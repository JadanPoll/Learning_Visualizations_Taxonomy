// ==UserScript==
// @name         PatentX – Highlight Arrow Graph
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Draw orthogonal, control-flow-style arrows between Glasp highlights (and free-floating central nodes) on Google Patents pages, with per-highlight annotations.
// @match        *://patents.google.com/patent*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  'use strict';

  // ─── Logging ──────────────────────────────────────────────────────────────

  const L = {
    info : (...a) => console.log ('%c[PXG]',   'color:#818cf8;font-weight:bold', ...a),
    ok   : (...a) => console.log ('%c[PXG ✓]', 'color:#22c55e;font-weight:bold', ...a),
    warn : (...a) => console.warn('%c[PXG ⚠]', 'color:#eab308;font-weight:bold', ...a),
    fail : (...a) => console.error('%c[PXG ✕]', 'color:#ef4444;font-weight:bold', ...a),
  };

  // ─── Loud failures ──────────────────────────────────────────────────────────
  // Nothing fails silently: every catch block in this script routes through
  // FAIL(), which logs to console AND shows a persistent, dismissible red
  // banner at the top of the page, then throws. Throwing is safe here — every
  // call site is inside an event handler, rAF callback, or interval tick,
  // each isolated by the browser's event loop, so it only aborts that one
  // operation rather than breaking the script.

  let failBanner = null;
  function ensureFailBanner() {
    if (failBanner && document.body && document.body.contains(failBanner)) return failBanner;
    if (!document.body) return null;
    failBanner = document.createElement('div');
    failBanner.id = 'pxg-fail-banner';
    document.body.prepend(failBanner);
    return failBanner;
  }

  // Shared by FAIL() (red, throws) and WARN_VISIBLE() (amber, doesn't throw).
  // Same de-dup behavior either way: a repeat of the exact same message just
  // flashes the existing line instead of stacking duplicates.
  function pushBannerLine(full, cssClass) {
    const banner = ensureFailBanner();
    if (!banner) return;
    const flashClass = cssClass === 'pxg-warn-line' ? 'pxg-warn-flash' : 'pxg-fail-flash';
    const top = banner.firstElementChild;
    if (top && top.dataset.msg === full) {
      top.classList.remove(flashClass);
      void top.offsetWidth;
      top.classList.add(flashClass);
      return;
    }
    const line = document.createElement('div');
    line.className = cssClass;
    line.dataset.msg = full;
    line.innerHTML = `<span class="pxg-fail-text"></span><span class="pxg-fail-close" title="Dismiss">✕</span>`;
    line.querySelector('.pxg-fail-text').textContent = '[PatentX] ' + full;
    line.querySelector('.pxg-fail-close').addEventListener('click', () => line.remove());
    banner.prepend(line);
  }

  function FAIL(msg, cause) {
    const full = cause ? `${msg} — ${cause.message || cause}` : msg;
    L.fail(msg, cause || '');
    pushBannerLine(full, 'pxg-fail-line');
    throw new Error('[PatentX] ' + full);
  }

  // For real but non-fatal problems — e.g. a structural selector we expect
  // to exist (verified against only two example patent pages) wasn't found,
  // so we've silently dropped into a degraded fallback. Visible, but doesn't
  // throw, since the fallback is expected to still mostly work.
  function WARN_VISIBLE(msg) {
    L.warn(msg);
    pushBannerLine(msg, 'pxg-warn-line');
  }

  // Wraps a callback so ANY uncaught error inside it — not just the ones we
  // anticipated with explicit FAIL() calls — surfaces in the banner instead
  // of vanishing into the console. If the error already went through FAIL()
  // deeper in the call stack, it's already visible, so skip the duplicate.
  function safely(fn, label) {
    try { fn(); }
    catch (e) {
      if (!String(e && e.message).startsWith('[PatentX]')) FAIL(`Unexpected error in ${label}`, e);
    }
  }

  // ─── Patent identity & storage key ────────────────────────────────────────

  function getPatentId() {
    const m = location.pathname.match(/\/patent\/([^/]+)/);
    return m ? m[1] : location.pathname;
  }
  let PATENT_ID = getPatentId();
  let STORE_KEY = 'pxg_graph_' + PATENT_ID;

  function gmGet(key, fallback) {
    try {
      const val = GM_getValue(key, null);
      if (val === null || val === undefined) return fallback;
      if (typeof val === 'string') { try { return JSON.parse(val); } catch { return fallback; } }
      return val;
    } catch (e) { FAIL(`Reading "${key}" from Tampermonkey storage failed`, e); }
  }
  function gmSet(key, value) {
    try { GM_setValue(key, value); }
    catch (e) { FAIL(`Saving "${key}" to Tampermonkey storage failed — your change was NOT persisted`, e); }
  }

  // ─── Graph state ──────────────────────────────────────────────────────────
  // arrows : [{ id, fromType:'highlight'|'node', fromId, toType, toId, label, color }]
  // nodes  : { [id]: { id, label, absX, absY } }   absX/absY = doc-space coords relative to SCROLL_PARENT
  // notes  : { [highlightId]: { text, updatedAt } }

  function normalizeGraph(g) {
    return {
      arrows: Array.isArray(g.arrows) ? g.arrows : [],
      nodes : (g.nodes && typeof g.nodes === 'object') ? g.nodes : {},
      notes : (g.notes && typeof g.notes === 'object') ? g.notes : {},
    };
  }

  // ─── Glasp anchor sync ─────────────────────────────────────────────────────
  // Mirrors Kami.user.js's anchor-comment trick: the whole graph is serialized
  // into one Glasp highlight's note behind a sentinel prefix. We can always
  // read it back automatically (data-glasp-note is a plain DOM attribute);
  // writing requires the user to paste it into Glasp's own note editor once,
  // since that editor lives in a cross-origin iframe we cannot script into.

  const SENTINEL = '[PXG_STATE_v1]';

  function encodeGraph(g) {
    return SENTINEL + btoa(unescape(encodeURIComponent(JSON.stringify(g))));
  }
  function decodeGraph(raw) {
    if (!raw || !raw.startsWith(SENTINEL)) return null;
    try { return normalizeGraph(JSON.parse(decodeURIComponent(escape(atob(raw.slice(SENTINEL.length)))))); }
    catch { return undefined; } // sentinel present but payload corrupt — distinct from "no anchor" (null)
  }
  function findAnchorHighlightId(groups) {
    for (const [id, g] of groups) if (g.note && g.note.startsWith(SENTINEL)) return id;
    return null;
  }

  let graph = normalizeGraph(gmGet(STORE_KEY, {}));
  function saveGraph() { gmSet(STORE_KEY, graph); }

  function loadFromGlaspAnchorIfPresent() {
    const groups = readGlaspHighlights();
    const anchorId = findAnchorHighlightId(groups);
    if (!anchorId) { L.info('No Glasp anchor highlight found — using local cache'); return; }
    const decoded = decodeGraph(groups.get(anchorId).note);
    if (decoded === null) return; // shouldn't happen — findAnchorHighlightId already confirmed the sentinel
    if (decoded === undefined) FAIL('The Glasp anchor highlight\'s note has the sync sentinel but its data is corrupt — it was not loaded. Your local copy of the graph is unaffected.');
    graph = decoded;
    saveGraph();
    L.ok(`Loaded graph from Glasp anchor highlight (${graph.arrows.length} arrows, ${Object.keys(graph.nodes).length} nodes, ${Object.keys(graph.notes).length} notes)`);
  }

  function copyToClipboard(text) {
    try {
      GM_setClipboard(text);
      return;
    } catch (e1) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(e2 =>
          FAIL('Could not copy to clipboard — GM_setClipboard and navigator.clipboard both failed', e2));
        return;
      }
      FAIL('Could not copy to clipboard — GM_setClipboard failed and navigator.clipboard is unavailable', e1);
    }
  }

  function syncToGlasp() {
    const groups = readGlaspHighlights();
    const anchorId = findAnchorHighlightId(groups);
    const blob = encodeGraph(graph);
    copyToClipboard(blob);

    // "Anchor" means a highlight whose Glasp note already holds our synced
    // blob — not just any highlight. If none qualifies yet but highlights
    // exist, use the first one as the anchor-to-be instead of making the
    // user go create a brand new highlight just for this.
    let targetId = anchorId;
    if (!targetId) {
      if (groups.size === 0) {
        alert('No Glasp highlights on this page yet.\n\nHighlight any small bit of text with Glasp first (e.g. the patent number), then click "☁ Sync to Glasp" again — the graph data has already been copied to your clipboard.');
        return;
      }
      targetId = groups.keys().next().value;
      setSyncStatus(`Copied to clipboard (${blob.length} chars). No highlight is acting as the sync anchor yet — scrolled to your first highlight below (pulsing). Click it, open its Glasp note, paste (Ctrl+V), and save there to start syncing.`);
    } else {
      setSyncStatus(`Copied to clipboard (${blob.length} chars). Scrolled to the anchor highlight below (pulsing) — click it, open its Glasp note, select all, paste (Ctrl+V), and save.`);
    }

    // Glasp's note editor lives in a cross-origin iframe we can't write into
    // or reliably trigger from here, so don't pretend a synthetic click opens
    // it — just make the target highlight unmistakable so you can click it
    // yourself.
    const els = document.querySelectorAll(`glasp.highlighter--highlighted[highlightid="${CSS.escape(targetId)}"]`);
    if (!els.length) FAIL('Could not find the target highlight in the page to scroll to — it may have just been removed.');
    els[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    els.forEach(el => el.classList.add('pxg-sync-flash'));
    setTimeout(() => els.forEach(el => el.classList.remove('pxg-sync-flash')), 2700);
  }

  function setSyncStatus(msg) {
    const el = byId('pxg-sync-status');
    if (el) el.textContent = msg;
  }

  function genId(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  const ARROW_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

  // ─── Glasp highlight reading ──────────────────────────────────────────────
  // Glasp wraps highlighted text in <glasp class="highlighter--highlighted"
  // highlightid="..." data-glasp-note="..." data-color-id="...">. One logical
  // highlight may be split across several <glasp> fragments sharing the same
  // highlightid — group and union their rects for anchoring.

  function readGlaspHighlights() {
    const elems = document.querySelectorAll('glasp.highlighter--highlighted');
    const groups = new Map();
    elems.forEach(el => {
      const id = el.getAttribute('highlightid');
      if (!id) return;
      if (!groups.has(id)) {
        groups.set(id, {
          id, els: [],
          note  : el.getAttribute('data-glasp-note') || '',
          color : el.getAttribute('data-color-id')  || '',
        });
      }
      groups.get(id).els.push(el);
    });
    groups.forEach(g => {
      g.text = g.els.map(e => e.textContent).join(' ').replace(/\s+/g, ' ').trim();
    });
    return groups; // Map<highlightId, group>
  }

  function getHighlightRect(highlightId) {
    const els = document.querySelectorAll(`glasp.highlighter--highlighted[highlightid="${CSS.escape(highlightId)}"]`);
    if (!els.length) return null;
    let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      left = Math.min(left, r.left); top = Math.min(top, r.top);
      right = Math.max(right, r.right); bottom = Math.max(bottom, r.bottom);
    });
    if (!isFinite(left)) return null;
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  }

  // ─── Scroll parent detection ──────────────────────────────────────────────
  // Google Patents may scroll an inner app container rather than the document.
  // Walk up from the patent text area to find whichever ancestor actually
  // scrolls; fall back to the document itself.

  function findScrollParent(start) {
    let node = start ? start.parentElement : null;
    while (node && node !== document.body) {
      const cs = getComputedStyle(node);
      if (/(auto|scroll)/.test(cs.overflowY) && node.scrollHeight > node.clientHeight + 4) return node;
      node = node.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  let SCROLL_PARENT = null;
  function scrollOffsets() {
    if (!SCROLL_PARENT || SCROLL_PARENT === document.scrollingElement || SCROLL_PARENT === document.documentElement) {
      return { x: window.scrollX, y: window.scrollY };
    }
    return { x: SCROLL_PARENT.scrollLeft, y: SCROLL_PARENT.scrollTop };
  }

  // ─── Node (central block) helpers ─────────────────────────────────────────

  function createNode(viewportX, viewportY, label) {
    const off = scrollOffsets();
    const id = genId('node');
    graph.nodes[id] = { id, label: label || 'Node', absX: viewportX + off.x, absY: viewportY + off.y };
    saveGraph();
    return id;
  }
  function deleteNode(id) {
    delete graph.nodes[id];
    graph.arrows = graph.arrows.filter(a => !((a.fromType === 'node' && a.fromId === id) || (a.toType === 'node' && a.toId === id)));
    saveGraph();
  }
  function getNodeRect(id) {
    const el = byId('pxg-node-' + id);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
  }

  // ─── Anchors (unify highlight / node lookup) ──────────────────────────────

  function getAnchorRect(type, id) {
    return type === 'node' ? getNodeRect(id) : getHighlightRect(id);
  }

  // ─── Arrow CRUD ────────────────────────────────────────────────────────────

  function createArrow(fromType, fromId, toType, toId) {
    if (fromType === toType && fromId === toId) return null;
    const id = genId('arrow');
    const color = ARROW_COLORS[graph.arrows.length % ARROW_COLORS.length];
    const groups = readGlaspHighlights();
    graph.arrows.push({
      id, fromType, fromId, toType, toId, label: '', color, gutterOffset: 0, gutterSide: 'right',
      // Glasp can reissue a highlight's id after it syncs to its backend (a
      // temporary local id gets swapped for a permanent one) or on some
      // reloads. Snapshotting the text lets resolveAnchorId() self-heal a
      // stale id instead of permanently showing "missing highlight".
      fromTextSnapshot: fromType === 'highlight' ? (groups.get(fromId)?.text ?? null) : null,
      toTextSnapshot  : toType   === 'highlight' ? (groups.get(toId)?.text   ?? null) : null,
    });
    saveGraph();
    return id;
  }
  function deleteArrow(id) {
    graph.arrows = graph.arrows.filter(a => a.id !== id);
    saveGraph();
  }

  // Resolves an arrow endpoint's current id, healing it in place if Glasp
  // has reissued the highlight's id since the arrow was created (see the
  // fromTextSnapshot/toTextSnapshot comment in createArrow). Returns null
  // if the endpoint is a highlight that's genuinely gone (deleted, or its
  // text changed enough that the snapshot no longer matches anything).
  function resolveAnchorId(arrow, which) {
    const type = arrow[which + 'Type'];
    const id = arrow[which + 'Id'];
    if (type !== 'highlight') return id;

    const groups = readGlaspHighlights();
    if (groups.has(id)) return id;

    const snapshot = arrow[which + 'TextSnapshot'];
    if (!snapshot) return null;

    const matches = Array.from(groups.values()).filter(g => g.text === snapshot);
    if (matches.length === 1) {
      L.info(`Arrow ${arrow.id}: highlight ${id} not found — healed to ${matches[0].id} via matching text`);
      arrow[which + 'Id'] = matches[0].id;
      saveGraph();
      return matches[0].id;
    }
    return null;
  }

  // ─── Orthogonal routing (circuit-trace style — cardinal directions only) ──
  // Connections never cut straight through a text column. For boxes in
  // different columns, the bend runs through the empty gap between them.
  // For boxes in the same column (typically a vertical relationship), the
  // route exits to the margin (right edge by default), runs down/up through
  // that gutter, then re-enters the target from the same side — like a
  // via on a circuit board, never crossing the text in between. The gutter
  // segment's position (arrow.gutterOffset) is user-draggable.

  function orthogonalPoints(s, t, arrow, seed) {
    const sCenter = { x: s.left + s.width / 2, y: s.top + s.height / 2 };
    const tCenter = { x: t.left + t.width / 2, y: t.top + t.height / 2 };
    const dx = tCenter.x - sCenter.x;
    const dy = tCenter.y - sCenter.y;

    const hSep = s.right < t.left || t.right < s.left;
    const vSep = s.bottom < t.top || t.bottom < s.top;

    const spread = ((seed % 5) - 2) * 6; // small automatic stagger so parallel arrows don't fully overlap by default
    const offset = (arrow.gutterOffset || 0) + spread;

    if (hSep && (!vSep || Math.abs(dx) >= Math.abs(dy))) {
      // Different columns — the bend already runs through the gap between them.
      const start = dx >= 0 ? { x: s.right, y: sCenter.y } : { x: s.left, y: sCenter.y };
      const end   = dx >= 0 ? { x: t.left,  y: tCenter.y } : { x: t.right, y: tCenter.y };
      if (Math.abs(start.y - end.y) < 0.5) return { points: [start, end], handle: null };
      const midX = (start.x + end.x) / 2 + offset;
      return { points: [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end], handle: { i: 1 } };
    }

    // Same column / vertical relationship — detour through the side margin.
    const side = arrow.gutterSide === 'left' ? 'left' : 'right';
    const start = { x: side === 'right' ? s.right : s.left, y: sCenter.y };
    const end   = { x: side === 'right' ? t.right : t.left, y: tCenter.y };
    const defaultGutterX = side === 'right'
      ? Math.max(s.right, t.right) + 36
      : Math.min(s.left, t.left) - 36;
    const gutterX = defaultGutterX + offset;
    return { points: [start, { x: gutterX, y: start.y }, { x: gutterX, y: end.y }, end], handle: { i: 1 } };
  }

  function pointsToPathD(points) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  }

  function pathLength(points) {
    let len = 0;
    for (let i = 1; i < points.length; i++) len += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    return len;
  }
  function pointAtFraction(points, frac) {
    const total = pathLength(points);
    let target = total * frac, acc = 0;
    for (let i = 1; i < points.length; i++) {
      const segLen = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
      if (acc + segLen >= target) {
        const f = segLen === 0 ? 0 : (target - acc) / segLen;
        return { x: points[i - 1].x + (points[i].x - points[i - 1].x) * f, y: points[i - 1].y + (points[i].y - points[i - 1].y) * f };
      }
      acc += segLen;
    }
    return points[points.length - 1];
  }

  // ─── DOM scaffolding ───────────────────────────────────────────────────────

  function byId(id) { return document.getElementById(id); }
  function escHtml(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  let root, svg, nodesLayer, badgesLayer;

  function ensureRoot() {
    if (root) return;
    root = document.createElement('div');
    root.id = 'pxg-root';
    document.body.appendChild(root);

    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'pxg-svg';
    const defs = document.createElementNS(svg.namespaceURI, 'defs');
    ARROW_COLORS.forEach((c, i) => {
      defs.innerHTML += `<marker id="pxg-head-${i}" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
        <path d="M0,0 L7,3.5 L0,7 Z" fill="${c}"/></marker>`;
    });
    svg.appendChild(defs);
    root.appendChild(svg);

    nodesLayer = document.createElement('div');
    nodesLayer.id = 'pxg-nodes-layer';
    root.appendChild(nodesLayer);

    badgesLayer = document.createElement('div');
    badgesLayer.id = 'pxg-badges-layer';
    root.appendChild(badgesLayer);
  }

  // ─── Styles ───────────────────────────────────────────────────────────────

  GM_addStyle(`
    #pxg-fail-banner {
      position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647;
      display: flex; flex-direction: column; pointer-events: none;
    }
    .pxg-fail-line {
      pointer-events: auto; position: relative;
      background: #3f0000; color: #fca5a5; border-bottom: 2px solid #ef4444;
      font: 700 12px/1.6 "Segoe UI", system-ui, sans-serif;
      padding: 8px 36px 8px 14px; white-space: pre-wrap; word-break: break-word;
    }
    .pxg-warn-line {
      pointer-events: auto; position: relative;
      background: #3f2200; color: #fde68a; border-bottom: 2px solid #eab308;
      font: 700 12px/1.6 "Segoe UI", system-ui, sans-serif;
      padding: 8px 36px 8px 14px; white-space: pre-wrap; word-break: break-word;
    }
    .pxg-warn-line .pxg-fail-text, .pxg-warn-line .pxg-fail-close { color: #fde68a; }
    .pxg-fail-close {
      position: absolute; top: 6px; right: 12px; cursor: pointer; font-size: 14px; color: #fca5a5;
    }
    .pxg-fail-line.pxg-fail-flash { animation: pxg-fail-flash 0.4s ease 2; }
    .pxg-warn-line.pxg-warn-flash { animation: pxg-warn-flash 0.4s ease 2; }
    @keyframes pxg-fail-flash { 0%, 100% { background: #3f0000; } 50% { background: #7f1d1d; } }
    @keyframes pxg-warn-flash { 0%, 100% { background: #3f2200; } 50% { background: #7c4a03; } }

    #pxg-root, #pxg-svg, #pxg-nodes-layer, #pxg-badges-layer {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none; z-index: 999990;
    }
    #pxg-svg path.pxg-hit { pointer-events: stroke; cursor: pointer; }
    #pxg-svg .pxg-arrow-visible { pointer-events: none; }
    #pxg-svg .pxg-arrow-selected { stroke-dasharray: 6 4 !important; }
    #pxg-svg path.pxg-handle-hit { pointer-events: stroke; cursor: ew-resize; }
    #pxg-svg circle.pxg-handle-grip { pointer-events: none; stroke: #1a1d27; stroke-width: 1.5; }
    .pxg-arrow-label {
      position: fixed; pointer-events: none; transform: translate(-50%, -50%);
      background: #12141ee0; color: #e2e4ed; font: 600 10px/1.4 "Segoe UI", system-ui, sans-serif;
      padding: 1px 6px; border-radius: 4px; white-space: nowrap; border: 1px solid #2e3245;
    }
    .pxg-node {
      position: fixed; pointer-events: auto; cursor: grab;
      background: #1a1d27; border: 1.5px solid #6366f1; border-radius: 8px;
      color: #e2e4ed; font: 600 12px/1.4 "Segoe UI", system-ui, sans-serif;
      padding: 8px 12px; max-width: 220px; word-break: break-word;
      box-shadow: 0 4px 16px rgba(0,0,0,.45); user-select: none;
    }
    .pxg-node.pxg-armed { border-color: #22c55e; box-shadow: 0 0 0 2px #22c55e88; }
    .pxg-node-del {
      position: absolute; top: -8px; right: -8px; width: 18px; height: 18px;
      background: #3f0000; color: #ef4444; border: 1px solid #ef4444; border-radius: 50%;
      font-size: 11px; line-height: 16px; text-align: center; cursor: pointer; display: none;
    }
    .pxg-node:hover .pxg-node-del { display: block; }
    .pxg-badge {
      position: fixed; pointer-events: none; transform: translate(0, -100%);
      background: #12141e; border: 1px solid #2e3245; border-radius: 5px;
      color: #e2e4ed; font: 600 10px/1.5 "Segoe UI", system-ui, sans-serif;
      padding: 0 5px; white-space: nowrap;
    }
    glasp.highlighter--highlighted.pxg-armed { outline: 2px solid #22c55e !important; outline-offset: 1px; }
    glasp.highlighter--highlighted.pxg-sync-flash {
      outline: 3px solid #6366f1 !important; outline-offset: 2px;
      animation: pxg-sync-pulse 0.9s ease-in-out 3;
    }
    @keyframes pxg-sync-pulse { 0%, 100% { outline-color: #6366f1; } 50% { outline-color: #c7d2fe; } }

    #pxg-panel {
      position: fixed; right: 0; top: 0; width: 320px; height: 100vh;
      background: #1a1d27; border-left: 1px solid #2e3245; z-index: 999998;
      display: flex; flex-direction: column; font: 13px/1.4 "Segoe UI", system-ui, sans-serif;
      color: #e2e4ed; transition: transform .2s ease;
    }
    #pxg-panel.pxg-hidden { transform: translateX(100%); }
    #pxg-toggle {
      position: fixed; top: 50%; transform: translateY(-50%); z-index: 999999;
      background: #6366f1; color: #fff; border: none; border-radius: 6px 0 0 6px;
      padding: 10px 5px; cursor: pointer; writing-mode: vertical-rl; font-size: 11px;
      font-weight: 700; letter-spacing: .08em; transition: right .2s ease;
    }
    #pxg-panel.pxg-hidden ~ #pxg-toggle { right: 0; }
    #pxg-panel:not(.pxg-hidden) ~ #pxg-toggle { right: 320px; }

    #pxg-header {
      background: #12141e; padding: 10px 14px; border-bottom: 1px solid #2e3245; flex-shrink: 0;
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
    }
    #pxg-header h2 { margin: 0; font-size: 13px; font-weight: 700; color: #6366f1; letter-spacing: .05em; text-transform: uppercase; }
    #pxg-sync-btn {
      background: #2e3245; color: #9ca3af; border: 1px solid #2e3245; border-radius: 6px;
      font-size: 10px; font-weight: 700; padding: 5px 8px; cursor: pointer; flex-shrink: 0;
    }
    #pxg-sync-btn:hover { border-color: #6366f1; color: #6366f1; }
    #pxg-view-btn {
      background: #2e3245; color: #9ca3af; border: 1px solid #2e3245; border-radius: 6px;
      font-size: 10px; font-weight: 700; padding: 5px 8px; cursor: pointer; flex-shrink: 0;
    }
    #pxg-view-btn:hover { border-color: #6366f1; color: #6366f1; }
    #pxg-sync-status {
      font-size: 10px; color: #9ca3af; padding: 0 12px 6px; line-height: 1.5; min-height: 12px; flex-shrink: 0;
    }

    #pxg-export-modal {
      position: fixed; inset: 0; z-index: 1000000; display: none;
      align-items: center; justify-content: center; background: rgba(0,0,0,.55);
    }
    #pxg-export-modal .pxg-export-card {
      width: 420px; max-width: 90vw; background: #1a1d27; border: 1px solid #2e3245; border-radius: 10px;
      padding: 14px; display: flex; flex-direction: column; gap: 8px;
      box-shadow: 0 12px 40px rgba(0,0,0,.6); font: 13px/1.4 "Segoe UI", system-ui, sans-serif; color: #e2e4ed;
    }
    #pxg-export-modal h3 { margin: 0; font-size: 12px; font-weight: 700; color: #6366f1; letter-spacing: .05em; text-transform: uppercase; }
    #pxg-export-summary { font-size: 11px; color: #9ca3af; line-height: 1.6; }
    #pxg-export-text {
      width: 100%; min-height: 120px; background: #12141e; border: 1px solid #2e3245; border-radius: 6px;
      color: #9ca3af; font: 11px/1.5 monospace; padding: 8px; resize: vertical; box-sizing: border-box;
    }
    #pxg-export-modal .pxg-editor-btns { display: flex; gap: 6px; }
    #pxg-export-modal button {
      flex: 1; padding: 6px 10px; border: none; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;
    }
    #pxg-export-copy { background: #6366f1; color: #fff; }
    #pxg-export-close { background: #2e3245; color: #e2e4ed; }
    #pxg-modes { display: flex; gap: 4px; padding: 8px 10px; border-bottom: 1px solid #2e3245; flex-shrink: 0; }
    .pxg-mode-btn {
      flex: 1; padding: 7px 2px; background: #12141e; border: 1px solid #2e3245; border-radius: 6px;
      color: #9ca3af; font-size: 10px; font-weight: 700; letter-spacing: .03em; cursor: pointer;
    }
    .pxg-mode-btn.active { border-color: #6366f1; color: #6366f1; background: #1e2035; }
    #pxg-hint { padding: 6px 12px; font-size: 11px; color: #9ca3af; border-bottom: 1px solid #2e3245; line-height: 1.5; flex-shrink: 0; }
    #pxg-body { flex: 1; overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 14px; }
    .pxg-section-label { font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; }
    .pxg-row {
      background: #12141e; border: 1px solid #2e3245; border-radius: 6px; padding: 6px 8px;
      display: flex; align-items: center; gap: 6px; margin-bottom: 5px; font-size: 11px;
    }
    .pxg-row-text { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor: pointer; }
    .pxg-row-text:hover { color: #6366f1; }
    .pxg-swatch { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; cursor: pointer; }
    .pxg-del-btn {
      background: none; border: 1px solid #2e3245; border-radius: 4px; color: #6b7280;
      font-size: 11px; padding: 1px 6px; cursor: pointer; flex-shrink: 0;
    }
    .pxg-del-btn:hover { border-color: #ef4444; color: #ef4444; }
    .pxg-empty { color: #6b7280; font-style: italic; font-size: 11px; }
    .pxg-note-icon { flex-shrink: 0; }

    #pxg-editor {
      position: fixed; z-index: 999999; background: #1a1d27; border: 1px solid #6366f1;
      border-radius: 8px; padding: 8px; width: 240px; box-shadow: 0 8px 28px rgba(0,0,0,.55);
      display: none; flex-direction: column; gap: 6px;
    }
    #pxg-editor textarea {
      width: 100%; min-height: 70px; background: #12141e; border: 1px solid #2e3245; border-radius: 5px;
      color: #e2e4ed; font: 12px/1.5 "Segoe UI", system-ui, sans-serif; padding: 6px; resize: vertical; box-sizing: border-box;
    }
    #pxg-editor .pxg-editor-btns { display: flex; gap: 6px; }
    #pxg-editor button {
      flex: 1; padding: 5px 8px; border: none; border-radius: 5px; font-size: 11px; font-weight: 600; cursor: pointer;
    }
    #pxg-editor .pxg-save { background: #6366f1; color: #fff; }
    #pxg-editor .pxg-cancel { background: #2e3245; color: #e2e4ed; }
    #pxg-editor .pxg-mirror { background: #2e3245; color: #9ca3af; font-size: 10px; }

    #pxg-arrow-del {
      position: fixed; z-index: 999999; background: #3f0000; color: #ef4444; border: 1px solid #ef4444;
      border-radius: 6px; padding: 4px 10px; font: 600 11px "Segoe UI", sans-serif; cursor: pointer; display: none;
    }
  `);

  // ─── Panel ────────────────────────────────────────────────────────────────

  let mode = 'select'; // select | connect | annotate | node
  let pendingSource = null; // { type, id }

  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'pxg-panel';
    panel.innerHTML = `
      <div id="pxg-header">
        <h2>PatentX Arrows</h2>
        <button id="pxg-view-btn" title="See the raw synced data and copy it out">👁 View</button>
        <button id="pxg-sync-btn" title="Serialize the graph and push it into the Glasp anchor highlight's note">☁ Sync to Glasp</button>
      </div>
      <div id="pxg-sync-status"></div>
      <div id="pxg-modes">
        <button class="pxg-mode-btn" data-mode="select">Select</button>
        <button class="pxg-mode-btn" data-mode="connect">Connect</button>
        <button class="pxg-mode-btn" data-mode="annotate">Annotate</button>
        <button class="pxg-mode-btn" data-mode="node">+ Node</button>
      </div>
      <div id="pxg-hint"></div>
      <div id="pxg-body"></div>
    `;
    document.body.appendChild(panel);

    const toggle = document.createElement('button');
    toggle.id = 'pxg-toggle';
    toggle.textContent = 'ARROWS';
    document.body.appendChild(toggle);
    toggle.addEventListener('click', () => panel.classList.toggle('pxg-hidden'));

    byId('pxg-sync-btn')?.addEventListener('click', syncToGlasp);
    byId('pxg-view-btn')?.addEventListener('click', openExportModal);
    byId('pxg-body').addEventListener('click', e => safely(() => handlePanelBodyClick(e), 'panel click'));

    panel.querySelectorAll('.pxg-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    const editor = document.createElement('div');
    editor.id = 'pxg-editor';
    editor.innerHTML = `
      <textarea id="pxg-editor-text"></textarea>
      <div class="pxg-editor-btns">
        <button class="pxg-save">Save</button>
        <button class="pxg-cancel">Cancel</button>
      </div>
      <button class="pxg-mirror" id="pxg-editor-mirror" style="display:none">Open in Glasp + copy text</button>
    `;
    document.body.appendChild(editor);

    const arrowDel = document.createElement('button');
    arrowDel.id = 'pxg-arrow-del';
    arrowDel.textContent = '✕ Delete arrow';
    document.body.appendChild(arrowDel);

    const exportModal = document.createElement('div');
    exportModal.id = 'pxg-export-modal';
    exportModal.innerHTML = `
      <div class="pxg-export-card">
        <h3>Synced data</h3>
        <div id="pxg-export-summary"></div>
        <textarea id="pxg-export-text" readonly></textarea>
        <div class="pxg-editor-btns">
          <button id="pxg-export-copy">Copy</button>
          <button id="pxg-export-close">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(exportModal);
    exportModal.addEventListener('click', e => { if (e.target === exportModal) exportModal.style.display = 'none'; });
    byId('pxg-export-close').addEventListener('click', () => { exportModal.style.display = 'none'; });
    byId('pxg-export-copy').addEventListener('click', () => {
      copyToClipboard(byId('pxg-export-text').value);
      setSyncStatus('Copied the blob shown in the View panel to your clipboard.');
    });

    setMode('select');
    renderPanelBody();
  }

  function openExportModal() {
    const groups = readGlaspHighlights();
    const anchorId = findAnchorHighlightId(groups);
    const summaryEl = byId('pxg-export-summary');
    const textEl = byId('pxg-export-text');

    if (anchorId) {
      const rawNote = groups.get(anchorId).note;
      const decoded = decodeGraph(rawNote);
      if (decoded === undefined) {
        summaryEl.textContent = `Anchor highlight found, but its note is corrupt and could not be decoded. Raw note text shown below in case you want to recover it manually.`;
      } else {
        summaryEl.textContent = `Synced via the Glasp anchor highlight: ${decoded.arrows.length} arrows, ${Object.keys(decoded.nodes).length} nodes, ${Object.keys(decoded.notes).length} notes. This is exactly what's stored in that highlight's Glasp note — copy it from here, or copy/paste it directly in Glasp's own UI/dashboard.`;
      }
      textEl.value = rawNote;
    } else {
      const hint = groups.size > 0
        ? `${groups.size} Glasp highlight${groups.size === 1 ? '' : 's'} found on this page, but none of them is currently storing the synced data yet (an "anchor" is a highlight whose Glasp note holds this blob — none does).`
        : `No Glasp highlights found on this page yet.`;
      summaryEl.textContent = `${hint} Showing your local (this-browser-only) graph instead — click "☁ Sync to Glasp" to push it into one of your highlights, or paste the blob below into any Glasp highlight's note yourself.`;
      textEl.value = encodeGraph(graph);
    }

    byId('pxg-export-modal').style.display = 'flex';
  }

  const HINTS = {
    select : 'Browse highlights and existing arrows. Glasp works normally in this mode.',
    connect: 'Click a highlight or node to start an arrow, then click another to finish it. Esc cancels.',
    annotate: 'Click a highlight or node to add/edit its note.',
    node   : 'Click empty space to drop a central node there.',
  };

  function setMode(m) {
    mode = m;
    pendingSource = null;
    document.querySelectorAll('.pxg-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    byId('pxg-hint').textContent = HINTS[m] || '';
    document.querySelectorAll('glasp.highlighter--highlighted.pxg-armed').forEach(el => el.classList.remove('pxg-armed'));
    document.querySelectorAll('.pxg-node.pxg-armed').forEach(el => el.classList.remove('pxg-armed'));
  }

  function renderPanelBody() {
    const body = byId('pxg-body');
    if (!body) return;
    const groups = readGlaspHighlights();

    const hlRows = groups.size
      ? Array.from(groups.values()).map(g => {
          const note = graph.notes[g.id]?.text || '';
          const isAnchor = g.note && g.note.startsWith(SENTINEL);
          const arrowCount = graph.arrows.filter(a => (a.fromType === 'highlight' && a.fromId === g.id) || (a.toType === 'highlight' && a.toId === g.id)).length;
          const dotColor = colorFromGlaspId(g.color);
          return `<div class="pxg-row">
            <span class="pxg-swatch" style="background:${dotColor}"></span>
            ${isAnchor ? '<span class="pxg-note-icon" title="This highlight carries the synced graph data">⚓</span>' : ''}
            <span class="pxg-row-text" data-jump-hl="${escHtml(g.id)}" title="${escHtml(g.text)}">${escHtml(g.text || '(empty)')}</span>
            ${note ? '<span class="pxg-note-icon" title="Has note">📝</span>' : ''}
            ${arrowCount ? `<span class="pxg-note-icon" title="${arrowCount} arrow(s)">→${arrowCount}</span>` : ''}
          </div>`;
        }).join('')
      : '<div class="pxg-empty">No Glasp highlights detected yet. Highlight text on the page first.</div>';

    const nodeRows = Object.values(graph.nodes).length
      ? Object.values(graph.nodes).map(n => `<div class="pxg-row">
          <span class="pxg-row-text" data-jump-node="${escHtml(n.id)}">${escHtml(n.label)}</span>
          <button class="pxg-del-btn" data-del-node="${escHtml(n.id)}">✕</button>
        </div>`).join('')
      : '<div class="pxg-empty">No central nodes yet — switch to "+ Node" mode and click the page.</div>';

    const arrowRows = graph.arrows.length
      ? graph.arrows.map(a => `<div class="pxg-row">
          <span class="pxg-swatch" style="background:${a.color}" data-cycle-color="${a.id}" title="Click to change color"></span>
          <span class="pxg-row-text" data-jump-arrow="${a.id}">${escHtml(anchorLabel(a, 'from'))} → ${escHtml(anchorLabel(a, 'to'))}${a.label ? ' · ' + escHtml(a.label) : ''}</span>
          <button class="pxg-del-btn" data-flip-arrow="${a.id}" title="Flip detour to the other margin">⇄</button>
          <button class="pxg-del-btn" data-edit-arrow="${a.id}">✎</button>
          <button class="pxg-del-btn" data-del-arrow="${a.id}">✕</button>
        </div>`).join('')
      : '<div class="pxg-empty">No arrows yet — switch to "Connect" mode.</div>';

    body.innerHTML = `
      <div>
        <div class="pxg-section-label">Highlights (${groups.size})</div>
        ${hlRows}
      </div>
      <div>
        <div class="pxg-section-label">Central nodes (${Object.values(graph.nodes).length})</div>
        ${nodeRows}
      </div>
      <div>
        <div class="pxg-section-label">Arrows (${graph.arrows.length})</div>
        ${arrowRows}
      </div>
    `;

  }

  // Single delegated listener bound once (in buildPanel) rather than per-row
  // — renderPanelBody() rebuilds body.innerHTML on every poll tick, so
  // attaching fresh listeners here every time would leak.
  function handlePanelBodyClick(e) {
    const jumpHl = e.target.closest('[data-jump-hl]');
    if (jumpHl) { if (getHighlightRect(jumpHl.dataset.jumpHl)) scrollAnchorIntoView('highlight', jumpHl.dataset.jumpHl); return; }

    const jumpNode = e.target.closest('[data-jump-node]');
    if (jumpNode) { scrollAnchorIntoView('node', jumpNode.dataset.jumpNode); return; }

    const jumpArrow = e.target.closest('[data-jump-arrow]');
    if (jumpArrow) { flashArrow(jumpArrow.dataset.jumpArrow); return; }

    const delNode = e.target.closest('[data-del-node]');
    if (delNode) { deleteNode(delNode.dataset.delNode); renderPanelBody(); scheduleRedraw(); return; }

    const delArrow = e.target.closest('[data-del-arrow]');
    if (delArrow) { deleteArrow(delArrow.dataset.delArrow); renderPanelBody(); scheduleRedraw(); return; }

    const editArrow = e.target.closest('[data-edit-arrow]');
    if (editArrow) { openArrowLabelEditor(editArrow.dataset.editArrow); return; }

    const flipArrow = e.target.closest('[data-flip-arrow]');
    if (flipArrow) {
      const a = graph.arrows.find(x => x.id === flipArrow.dataset.flipArrow);
      if (a) { a.gutterSide = a.gutterSide === 'left' ? 'right' : 'left'; a.gutterOffset = 0; saveGraph(); scheduleRedraw(); }
      return;
    }

    const cycleColor = e.target.closest('[data-cycle-color]');
    if (cycleColor) {
      const a = graph.arrows.find(x => x.id === cycleColor.dataset.cycleColor);
      if (a) { const i = ARROW_COLORS.indexOf(a.color); a.color = ARROW_COLORS[(i + 1) % ARROW_COLORS.length]; saveGraph(); renderPanelBody(); scheduleRedraw(); }
    }
  }

  function colorFromGlaspId(colorId) {
    const map = { yellow: '#facc15', red: '#ef4444', green: '#22c55e', blue: '#3b82f6', purple: '#a855f7' };
    return map[String(colorId).toLowerCase()] || '#6b7280';
  }

  // Resolves + labels an arrow endpoint in one step. If the highlight is
  // genuinely gone (not just a stale id healed by resolveAnchorId — actually
  // deleted, e.g. by the user removing it in Glasp), shows what it used to
  // say instead of a bare "(missing highlight)", so it's clear this is
  // expected fallout from a deletion rather than a detection bug.
  function anchorLabel(arrow, which) {
    const type = arrow[which + 'Type'];
    const resolvedId = resolveAnchorId(arrow, which);

    if (type === 'node') return graph.nodes[resolvedId]?.label || '(deleted node)';

    if (resolvedId) {
      const g = readGlaspHighlights().get(resolvedId);
      return g ? (g.text.slice(0, 24) || '(empty highlight)') : '(missing highlight)';
    }
    const snapshot = arrow[which + 'TextSnapshot'];
    return snapshot ? `(deleted: "${snapshot.slice(0, 24)}${snapshot.length > 24 ? '…' : ''}")` : '(missing highlight)';
  }

  function scrollAnchorIntoView(type, id) {
    if (type === 'node') {
      const el = byId('pxg-node-' + id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const els = document.querySelectorAll(`glasp.highlighter--highlighted[highlightid="${CSS.escape(id)}"]`);
    els[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function flashArrow(id) {
    const path = document.querySelector(`#pxg-svg path.pxg-arrow-visible[data-arrow="${id}"]`);
    if (!path) return;
    path.classList.add('pxg-arrow-selected');
    setTimeout(() => path.classList.remove('pxg-arrow-selected'), 1200);
  }

  // ─── Editor popup (annotation / node label / arrow label) ─────────────────

  let editorSave = null;

  function openEditor({ x, y, initialText, mirrorHint, onSave }) {
    const editor = byId('pxg-editor');
    const ta = byId('pxg-editor-text');
    const mirrorBtn = byId('pxg-editor-mirror');
    ta.value = initialText || '';
    editorSave = onSave;

    const vw = window.innerWidth, vh = window.innerHeight;
    editor.style.left = Math.min(x, vw - 260) + 'px';
    editor.style.top  = Math.min(y, vh - 180) + 'px';
    editor.style.display = 'flex';

    if (mirrorHint) {
      mirrorBtn.style.display = 'block';
      mirrorBtn.onclick = () => mirrorToGlasp(mirrorHint, ta.value);
    } else {
      mirrorBtn.style.display = 'none';
      mirrorBtn.onclick = null;
    }

    ta.focus();
  }

  function closeEditor() {
    byId('pxg-editor').style.display = 'none';
    editorSave = null;
  }

  function bindEditorButtons() {
    byId('pxg-editor').querySelector('.pxg-save').addEventListener('click', () => {
      const text = byId('pxg-editor-text').value;
      if (editorSave) editorSave(text);
      closeEditor();
      renderPanelBody();
      scheduleRedraw();
    });
    byId('pxg-editor').querySelector('.pxg-cancel').addEventListener('click', closeEditor);
  }

  function openAnnotationEditor(highlightId, x, y) {
    const existing = graph.notes[highlightId]?.text || '';
    openEditor({
      x, y, initialText: existing, mirrorHint: highlightId,
      onSave: text => {
        if (text.trim()) graph.notes[highlightId] = { text, updatedAt: new Date().toISOString() };
        else delete graph.notes[highlightId];
        saveGraph();
      },
    });
  }

  function openNodeLabelEditor(nodeId, x, y) {
    openEditor({
      x, y, initialText: graph.nodes[nodeId]?.label || '',
      onSave: text => { if (graph.nodes[nodeId]) { graph.nodes[nodeId].label = text || 'Node'; saveGraph(); } },
    });
  }

  function openArrowLabelEditor(arrowId) {
    const a = graph.arrows.find(x => x.id === arrowId);
    if (!a) return;
    openEditor({
      x: window.innerWidth / 2 - 120, y: window.innerHeight / 2 - 90, initialText: a.label,
      onSave: text => { a.label = text; saveGraph(); },
    });
  }

  function mirrorToGlasp(highlightId, text) {
    const els = document.querySelectorAll(`glasp.highlighter--highlighted[highlightid="${CSS.escape(highlightId)}"]`);
    if (!els.length) FAIL('Could not mirror to Glasp — that highlight is no longer in the page (Glasp may have removed it, or the page reflowed).');
    copyToClipboard(text);
    // Glasp's note editor is in a cross-origin iframe we can't open or write
    // into directly — scroll to and flash the highlight so it's unmistakable
    // which one to click yourself.
    els[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    els.forEach(el => el.classList.add('pxg-sync-flash'));
    setTimeout(() => els.forEach(el => el.classList.remove('pxg-sync-flash')), 2700);
    setSyncStatus('Copied note to clipboard and scrolled to the highlight (pulsing) — click it, open its Glasp note, and paste with Ctrl+V.');
  }

  // ─── Node rendering & dragging ─────────────────────────────────────────────
  // Drag state for both node-dragging and gutter-handle-dragging is centralized
  // here and driven by a single pair of document-level listeners bound once in
  // bindGlobalEvents — per-element/per-render listener attachment would leak.

  let activeDrag = null; // { move(e), up() }

  function renderNodes() {
    const off = scrollOffsets();
    const seen = new Set();
    Object.values(graph.nodes).forEach(n => {
      seen.add(n.id);
      let el = byId('pxg-node-' + n.id);
      if (!el) { el = makeNodeEl(n.id); nodesLayer.appendChild(el); }
      el.style.left = (n.absX - off.x) + 'px';
      el.style.top  = (n.absY - off.y) + 'px';
      el.querySelector('.pxg-node-label').textContent = n.label;
    });
    nodesLayer.querySelectorAll('.pxg-node').forEach(el => {
      const id = el.dataset.nodeId;
      if (!seen.has(id)) el.remove();
    });
  }

  function makeNodeEl(id) {
    const el = document.createElement('div');
    el.className = 'pxg-node';
    el.id = 'pxg-node-' + id;
    el.dataset.nodeId = id;
    el.innerHTML = `<span class="pxg-node-label"></span><span class="pxg-node-del" title="Delete node">✕</span>`;

    el.querySelector('.pxg-node-del').addEventListener('click', e => {
      e.stopPropagation();
      deleteNode(id); renderPanelBody(); scheduleRedraw();
    });

    let moved = false;
    el.addEventListener('mousedown', e => {
      if (mode === 'connect' || e.target.classList.contains('pxg-node-del')) return;
      moved = false;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - r.left, dy = e.clientY - r.top;
      el.style.cursor = 'grabbing';
      e.preventDefault();
      activeDrag = {
        move(e2) {
          moved = true;
          const off2 = scrollOffsets();
          const node = graph.nodes[id];
          if (!node) return;
          node.absX = e2.clientX - dx + off2.x;
          node.absY = e2.clientY - dy + off2.y;
          renderNodes(); scheduleRedrawArrowsOnly();
        },
        up() {
          el.style.cursor = 'grab';
          if (moved) saveGraph();
        },
      };
    });

    el.addEventListener('click', e => {
      if (moved) { moved = false; return; }
      handleAnchorClick('node', id, e);
    });

    return el;
  }

  // ─── Badges ────────────────────────────────────────────────────────────────

  function renderBadges() {
    badgesLayer.innerHTML = '';
    const groups = readGlaspHighlights();
    groups.forEach((g, id) => {
      const note = graph.notes[id]?.text;
      const arrowCount = graph.arrows.filter(a => (a.fromType === 'highlight' && a.fromId === id) || (a.toType === 'highlight' && a.toId === id)).length;
      if (!note && !arrowCount) return;
      const rect = getHighlightRect(id);
      if (!rect) return;
      const badge = document.createElement('div');
      badge.className = 'pxg-badge';
      badge.style.left = rect.right + 'px';
      badge.style.top  = rect.top + 'px';
      badge.textContent = (note ? '📝' : '') + (arrowCount ? ` →${arrowCount}` : '');
      badgesLayer.appendChild(badge);
    });
  }

  // ─── Arrow rendering ────────────────────────────────────────────────────────

  function renderArrows() {
    svg.querySelectorAll('g.pxg-arrow-g').forEach(g => g.remove());
    document.querySelectorAll('.pxg-arrow-label').forEach(l => l.remove());

    graph.arrows.forEach((a, i) => {
      const fromId = resolveAnchorId(a, 'from');
      const toId   = resolveAnchorId(a, 'to');
      if (!fromId || !toId) return;
      const sRect = getAnchorRect(a.fromType, fromId);
      const tRect = getAnchorRect(a.toType, toId);
      if (!sRect || !tRect) return;

      const { points, handle } = orthogonalPoints(sRect, tRect, a, i);
      const d = pointsToPathD(points);
      const colorIdx = ARROW_COLORS.indexOf(a.color);

      const g = document.createElementNS(svg.namespaceURI, 'g');
      g.classList.add('pxg-arrow-g');

      const hit = document.createElementNS(svg.namespaceURI, 'path');
      hit.classList.add('pxg-hit');
      hit.setAttribute('d', d);
      hit.setAttribute('stroke', 'transparent');
      hit.setAttribute('stroke-width', '14');
      hit.setAttribute('fill', 'none');
      hit.dataset.arrow = a.id;
      hit.addEventListener('click', e => showArrowDelete(a.id, e.clientX, e.clientY));

      const visible = document.createElementNS(svg.namespaceURI, 'path');
      visible.classList.add('pxg-arrow-visible');
      visible.setAttribute('d', d);
      visible.setAttribute('stroke', a.color);
      visible.setAttribute('stroke-width', '2');
      visible.setAttribute('fill', 'none');
      visible.setAttribute('marker-end', `url(#pxg-head-${colorIdx >= 0 ? colorIdx : 0})`);
      visible.dataset.arrow = a.id;

      g.appendChild(visible);
      g.appendChild(hit);

      if (handle) {
        const p1 = points[handle.i], p2 = points[handle.i + 1];
        attachGutterHandle(g, a, p1, p2);
      }

      svg.appendChild(g);

      if (a.label) {
        const mid = pointAtFraction(points, 0.5);
        const lbl = document.createElement('div');
        lbl.className = 'pxg-arrow-label';
        lbl.style.left = mid.x + 'px';
        lbl.style.top  = mid.y + 'px';
        lbl.textContent = a.label;
        root.appendChild(lbl);
      }
    });
  }

  // Draggable "handlebar" on the gutter segment of an arrow — drag
  // horizontally to push the detour further out or pull it back in.
  function attachGutterHandle(g, arrow, p1, p2) {
    const handleHit = document.createElementNS(svg.namespaceURI, 'path');
    handleHit.classList.add('pxg-handle-hit');
    handleHit.setAttribute('d', `M${p1.x.toFixed(1)},${p1.y.toFixed(1)} L${p2.x.toFixed(1)},${p2.y.toFixed(1)}`);
    handleHit.setAttribute('stroke', 'transparent');
    handleHit.setAttribute('stroke-width', '16');
    handleHit.setAttribute('fill', 'none');

    const midY = (p1.y + p2.y) / 2;
    const grip = document.createElementNS(svg.namespaceURI, 'circle');
    grip.classList.add('pxg-handle-grip');
    grip.setAttribute('cx', p1.x.toFixed(1));
    grip.setAttribute('cy', midY.toFixed(1));
    grip.setAttribute('r', '4');
    grip.setAttribute('fill', arrow.color);

    const onDown = e => {
      e.stopPropagation();
      const startX = e.clientX;
      const startOffset = arrow.gutterOffset || 0;
      let moved = false;
      activeDrag = {
        move(e2) {
          const delta = e2.clientX - startX;
          if (Math.abs(delta) > 2) moved = true;
          arrow.gutterOffset = startOffset + delta;
          scheduleRedrawArrowsOnly();
        },
        up() {
          if (moved) saveGraph();
        },
      };
    };
    handleHit.addEventListener('mousedown', onDown);
    grip.addEventListener('mousedown', onDown);

    g.appendChild(handleHit);
    g.appendChild(grip);
  }

  function showArrowDelete(arrowId, x, y) {
    const btn = byId('pxg-arrow-del');
    btn.style.left = x + 'px';
    btn.style.top  = y + 'px';
    btn.style.display = 'block';
    btn.onclick = () => { deleteArrow(arrowId); btn.style.display = 'none'; renderPanelBody(); scheduleRedraw(); };
    const hide = e => { if (e.target !== btn) { btn.style.display = 'none'; document.removeEventListener('click', hide, true); } };
    setTimeout(() => document.addEventListener('click', hide, true), 0);
  }

  // ─── Connect / annotate / node interaction ─────────────────────────────────

  function handleAnchorClick(type, id, evt) {
    if (mode === 'connect') {
      evt.stopPropagation();
      if (!pendingSource) {
        pendingSource = { type, id };
        armAnchor(type, id, true);
      } else if (pendingSource.type === type && pendingSource.id === id) {
        armAnchor(type, id, false);
        pendingSource = null;
      } else {
        createArrow(pendingSource.type, pendingSource.id, type, id);
        armAnchor(pendingSource.type, pendingSource.id, false);
        pendingSource = null;
        renderPanelBody(); scheduleRedraw();
      }
      return;
    }
    if (mode === 'annotate') {
      evt.stopPropagation();
      const rect = getAnchorRect(type, id);
      const x = rect ? rect.left : evt.clientX, y = rect ? rect.bottom + 6 : evt.clientY;
      if (type === 'highlight') openAnnotationEditor(id, x, y);
      else openNodeLabelEditor(id, x, y);
    }
  }

  function armAnchor(type, id, on) {
    if (type === 'node') {
      byId('pxg-node-' + id)?.classList.toggle('pxg-armed', on);
    } else {
      document.querySelectorAll(`glasp.highlighter--highlighted[highlightid="${CSS.escape(id)}"]`)
        .forEach(el => el.classList.toggle('pxg-armed', on));
    }
  }

  function bindGlobalEvents() {
    document.addEventListener('click', e => safely(() => {
      if (e.target.closest('#pxg-panel, #pxg-toggle, #pxg-editor, #pxg-arrow-del, .pxg-node')) return;

      const glaspEl = e.target.closest('glasp.highlighter--highlighted');
      if (glaspEl) {
        const id = glaspEl.getAttribute('highlightid');
        if (id && (mode === 'connect' || mode === 'annotate')) handleAnchorClick('highlight', id, e);
        return;
      }

      if (mode === 'node') {
        e.preventDefault();
        const id = createNode(e.clientX, e.clientY, 'Node');
        renderNodes(); renderPanelBody(); scheduleRedraw();
        const el = byId('pxg-node-' + id);
        const r = el.getBoundingClientRect();
        openNodeLabelEditor(id, r.left, r.bottom + 6);
      }
    }, 'page click handler'), true);

    document.addEventListener('keydown', e => safely(() => {
      if (e.key !== 'Escape') return;
      if (pendingSource) { armAnchor(pendingSource.type, pendingSource.id, false); pendingSource = null; }
      closeEditor();
      byId('pxg-arrow-del').style.display = 'none';
    }, 'keydown handler'));

    window.addEventListener('resize', scheduleRedraw);
    document.addEventListener('scroll', scheduleRedraw, true);

    document.addEventListener('mousemove', e => activeDrag?.move(e));
    document.addEventListener('mouseup', e => { activeDrag?.up(e); activeDrag = null; });

    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.target.closest && m.target.closest('#pxg-root, #pxg-panel, #pxg-editor, #pxg-arrow-del')) continue;
        scheduleRedraw();
        return;
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['highlightid', 'class', 'style'] });

    setInterval(scheduleRedraw, 2000); // safety net for missed layout shifts
  }

  // ─── Redraw scheduling ──────────────────────────────────────────────────────

  let redrawScheduled = false;
  function scheduleRedraw() {
    if (redrawScheduled) return;
    redrawScheduled = true;
    requestAnimationFrame(() => {
      redrawScheduled = false;
      safely(() => { renderNodes(); renderArrows(); renderBadges(); }, 'redraw');
    });
  }

  let arrowsOnlyScheduled = false;
  function scheduleRedrawArrowsOnly() {
    if (arrowsOnlyScheduled) return;
    arrowsOnlyScheduled = true;
    requestAnimationFrame(() => {
      arrowsOnlyScheduled = false;
      safely(() => { renderArrows(); renderBadges(); }, 'arrow redraw');
    });
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────

  let booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    safely(() => {
      L.info('Boot —', PATENT_ID);

      ensureRoot();
      buildPanel();
      bindEditorButtons();
      bindGlobalEvents();
      applyPatentContext();

      let watchedHref = location.href;
      setInterval(() => safely(() => {
        if (location.href !== watchedHref) {
          watchedHref = location.href;
          L.info('URL changed (likely an in-app citation/family link, no real navigation) — switching context to', getPatentId());
          applyPatentContext();
        } else {
          renderPanelBody();
        }
      }, 'URL-watch tick'), 1500);

      L.ok('Boot complete');
    }, 'boot');
  }

  // Google Patents is a Polymer SPA: clicking a "Cited by" / "Similar" /
  // family-member link does a client-side route change (pushState) rather
  // than a real navigation, so @match never re-injects the script for the
  // new patent. The href-watcher above calls this to manually re-derive the
  // patent identity, swap in that patent's graph, and clear stale overlays.
  function applyPatentContext() {
    PATENT_ID = getPatentId();
    STORE_KEY = 'pxg_graph_' + PATENT_ID;
    graph = normalizeGraph(gmGet(STORE_KEY, {}));

    pendingSource = null;
    setMode('select');
    closeEditor();
    const delBtn = byId('pxg-arrow-del');
    if (delBtn) delBtn.style.display = 'none';

    if (nodesLayer) nodesLayer.innerHTML = '';
    if (badgesLayer) badgesLayer.innerHTML = '';
    if (svg) svg.querySelectorAll('g.pxg-arrow-g').forEach(g => g.remove());
    document.querySelectorAll('.pxg-arrow-label').forEach(l => l.remove());

    // "patent-result #text" is the one structural selector this script
    // depends on, verified against exactly two example pages (granted US
    // utility patents). If it's missing — a different patent type/layout,
    // or Google changed their markup — warn instead of silently degrading
    // to document.body, which may scroll-track less precisely.
    const textArea = document.querySelector('patent-result #text');
    if (!textArea) WARN_VISIBLE('Expected page structure "patent-result #text" not found — falling back to document.body for scroll tracking. Arrows may drift on scroll on this page (untested patent type/layout).');
    SCROLL_PARENT = findScrollParent(textArea || document.body);
    L.info('Scroll parent —', SCROLL_PARENT === document.documentElement ? 'document' : (SCROLL_PARENT.tagName || SCROLL_PARENT));

    renderPanelBody();
    scheduleRedraw();
    pollAnchorBriefly();
  }

  // Glasp (re-)injects highlights asynchronously after the patent content
  // loads — poll briefly so a graph synced via the Glasp anchor note picks
  // up automatically without the user having to hit "Sync to Glasp" first.
  function pollAnchorBriefly() {
    let checks = 0;
    const t = setInterval(() => {
      // The increment/clear must run even if loadFromGlaspAnchorIfPresent()
      // throws (e.g. a corrupt anchor blob via FAIL) — otherwise a bad anchor
      // would make this interval poll forever instead of giving up after 10 tries.
      safely(() => { loadFromGlaspAnchorIfPresent(); renderPanelBody(); scheduleRedraw(); }, 'anchor poll');
      if (++checks >= 10) clearInterval(t);
    }, 1000);
  }

  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot);

})();
