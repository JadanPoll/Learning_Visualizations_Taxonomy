// ==UserScript==
// @name         YT Comment Extractor — Length Filter
// @namespace    http://tampermonkey.net/
// @version      5.0.0
// @description  Collapsed card top-right. Fetch comments via Innertube (2025+ schema). Filter by length, sorted shortest-first. Copy to clipboard.
// @author       Claude
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/shorts/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  if (window.__YT_CE_LOADED__) return;
  window.__YT_CE_LOADED__ = true;

  // ─────────────────────────────────────────────
  // SCHEMA CONSTANTS — edit these if YouTube changes the response shape
  // Run parsePage() in console with a raw response to debug
  // ─────────────────────────────────────────────
  const SCHEMA = {
    // Path to get the list of continuation items per page
    continuationItems: (data) =>
      (data?.onResponseReceivedEndpoints ?? [])
        .flatMap(ep =>
          ep?.appendContinuationItemsAction?.continuationItems ??
          ep?.reloadContinuationItemsCommand?.continuationItems ?? []),

    // From a continuationItem, get the commentThreadRenderer (top-level or subThread)
    threadRenderer: (item) => item?.commentThreadRenderer,

    // From a commentThreadRenderer, get the commentKey used to look up the mutation
    commentKey: (thread) => thread?.commentViewModel?.commentViewModel?.commentKey,

    // From a commentThreadRenderer, get inline subThreads (pre-loaded replies)
    subThreads: (thread) =>
      thread?.replies?.commentRepliesRenderer?.subThreads ?? [],

    // From a continuationItem, get the next-page continuation token
    nextToken: (item) =>
      item?.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token,

    // From the full response, get all entity mutations
    mutations: (data) =>
      data?.frameworkUpdates?.entityBatchUpdate?.mutations ?? [],

    // From a mutation, get the commentEntityPayload (returns null for non-comment mutations)
    commentPayload: (mutation) =>
      mutation?.payload?.commentEntityPayload ?? null,

    // From a commentEntityPayload, extract fields
    text:      (p) => p?.properties?.content?.content ?? '',
    author:    (p) => p?.author?.displayName ?? p?.properties?.authorButtonA11y ?? '?',
    commentId: (p) => p?.properties?.commentId ?? '',
    replyLevel:(p) => p?.properties?.replyLevel ?? 0,   // 0=top, 1=reply, 2=subreply
    likes:     (p) => {
      // "0 likes", "1 like", "1.2K likes" — parse the number out
      const a11y = p?.toolbar?.likeCountA11y ?? '';
      const m = a11y.match(/([\d,.]+[KMBkmb]?)/);
      if (!m) return 0;
      const s = m[1].replace(/,/g, '');
      if (/[Kk]$/.test(s)) return Math.round(parseFloat(s) * 1000);
      if (/[Mm]$/.test(s)) return Math.round(parseFloat(s) * 1_000_000);
      return parseInt(s) || 0;
    },
  };

  // ─────────────────────────────────────────────
  // CONFIG
  // ─────────────────────────────────────────────
  const CARD_ID = 'yt-ce-card';
  const MIN = 30, MAX = 500, DEFAULT = 80;

  let comments   = [];
  let fetching   = false;
  let expanded   = false;
  let currentMin = DEFAULT;
  let lastVid    = null;

  // ─────────────────────────────────────────────
  // STYLES
  // ─────────────────────────────────────────────
  GM_addStyle(`
    #yt-ce-card {
      position: fixed; top: 70px; right: 0;
      width: 36px; z-index: 2147483647;
      background: #111; border: 1px solid #2a2a2a; border-right: none;
      border-radius: 8px 0 0 8px;
      box-shadow: -4px 4px 24px rgba(0,0,0,.6);
      font-family: 'Inter', system-ui, sans-serif; color: #ddd;
      transition: width .2s ease; overflow: hidden; display: flex;
    }
    #yt-ce-card.yt-ce-open { width: 400px; }
    #yt-ce-tab {
      width: 36px; min-width: 36px; min-height: 56px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; flex-shrink: 0; background: #111;
    }
    #yt-ce-card.yt-ce-open #yt-ce-tab { background: #0a0a0a; border-right: 1px solid #2a2a2a; }
    #yt-ce-inner {
      flex: 1; display: flex; flex-direction: column;
      max-height: calc(100vh - 90px); min-width: 0;
      opacity: 0; pointer-events: none; transition: opacity .15s ease .05s;
    }
    #yt-ce-card.yt-ce-open #yt-ce-inner { opacity: 1; pointer-events: all; }

    #yt-ce-head { padding: 10px 14px 8px; border-bottom: 1px solid #1e1e1e; flex-shrink: 0; }
    #yt-ce-title { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #555; margin-bottom: 8px; }
    #yt-ce-slider-row { display: flex; align-items: center; gap: 8px; }
    #yt-ce-slider-lbl { font-size: 10px; color: #555; white-space: nowrap; }
    #yt-ce-slider {
      flex: 1; -webkit-appearance: none; appearance: none;
      height: 3px; background: #2a2a2a; border-radius: 2px; outline: none; cursor: pointer; margin: 0;
    }
    #yt-ce-slider::-webkit-slider-thumb {
      -webkit-appearance: none; width: 14px; height: 14px;
      border-radius: 50%; background: #e00; border: 2px solid #111; cursor: grab;
    }
    #yt-ce-val { font-size: 11px; font-weight: 700; color: #e55; min-width: 26px; text-align: right; }
    #yt-ce-stats { font-size: 10px; color: #444; margin-top: 5px; }
    #yt-ce-stats b { color: #aaa; }

    /* ── schema warning banner ── */
    #yt-ce-warn {
      margin: 8px 14px; padding: 8px 10px;
      background: #2a0a00; border: 1px solid #aa3300;
      border-radius: 4px; font-size: 10px; line-height: 1.5; color: #ff7744;
    }
    #yt-ce-warn b { color: #ff5500; }

    #yt-ce-list { overflow-y: auto; flex: 1; min-height: 0; }
    #yt-ce-list::-webkit-scrollbar { width: 3px; }
    #yt-ce-list::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }

    .yt-ce-item { padding: 7px 14px; border-bottom: 1px solid #161616; }
    .yt-ce-item.yt-ce-reply { padding-left: 22px; border-left: 2px solid #1e1e1e; margin-left: 12px; }
    .yt-ce-item.yt-ce-subreply { padding-left: 28px; border-left: 2px solid #2a1a00; margin-left: 18px; }
    .yt-ce-meta { display: flex; align-items: center; gap: 5px; margin-bottom: 2px; }
    .yt-ce-author { font-size: 10px; font-weight: 600; color: #777; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 120px; }
    .yt-ce-rtag { font-size: 9px; color: #383838; background: #1a1a1a; border-radius: 3px; padding: 1px 4px; }
    .yt-ce-likes { font-size: 10px; color: #383838; margin-left: auto; white-space: nowrap; }
    .yt-ce-likes.hl { color: #777; }
    .yt-ce-len { font-size: 9px; font-weight: 700; color: #252525; }
    .yt-ce-text { font-size: 11px; line-height: 1.5; color: #bbb; word-break: break-word; user-select: text; }
    .yt-ce-dim .yt-ce-text   { color: #2a2a2a; }
    .yt-ce-dim .yt-ce-author { color: #2a2a2a; }
    .yt-ce-dim .yt-ce-len    { color: #1e1e1e; }
    .yt-ce-dim .yt-ce-likes  { color: #1e1e1e; }

    .yt-ce-cut {
      padding: 4px 14px; text-align: center; font-size: 9px; font-weight: 700;
      letter-spacing: .08em; text-transform: uppercase; color: #c33;
      background: #130606; border-top: 1px dashed #2e0e0e; border-bottom: 1px dashed #2e0e0e;
    }
    .yt-ce-empty { padding: 32px 14px; text-align: center; color: #333; font-size: 11px; }

    #yt-ce-foot { padding: 8px 14px; border-top: 1px solid #1a1a1a; display: flex; gap: 6px; flex-shrink: 0; }
    .yt-ce-fbtn { flex: 1; padding: 8px 0; border: none; border-radius: 5px; font: 600 11px/1 'Inter', system-ui, sans-serif; cursor: pointer; white-space: nowrap; }
    .yt-ce-red  { background: #e00; color: #fff; }
    .yt-ce-red.ok { background: #1a6e35; }
    .yt-ce-grey { background: #1c1c1c; color: #777; border: 1px solid #2a2a2a; }
    .yt-ce-sp {
      display: inline-block; width: 10px; height: 10px;
      border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
      border-radius: 50%; animation: yt-ce-spin .7s linear infinite;
      vertical-align: middle; margin-right: 4px;
    }
    @keyframes yt-ce-spin { to { transform: rotate(360deg); } }
  `);

  // ─────────────────────────────────────────────
  // DOM HELPER — no innerHTML anywhere (Trusted Types safe)
  // ─────────────────────────────────────────────
  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'cls') v.split(' ').filter(Boolean).forEach(c => e.classList.add(c));
      else if (k === 'txt') e.textContent = v;
      else e.setAttribute(k, v);
    }
    for (const k of kids) {
      if (k == null) continue;
      e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k);
    }
    return e;
  }

  function emptyMsg(txt) { return el('div', { cls: 'yt-ce-empty', txt }); }

  function makeFetchBtn() {
    const b = el('button', { cls: 'yt-ce-fbtn yt-ce-red', txt: 'Fetch comments' });
    b.addEventListener('click', () => { if (!fetching) doFetch(); });
    return b;
  }

  // ─────────────────────────────────────────────
  // BUILD CARD
  // ─────────────────────────────────────────────
  function buildCard() {
    if (document.getElementById(CARD_ID)) return;

    const sliderVal = el('span', { id: 'yt-ce-val', txt: String(currentMin) });
    const slider = el('input', { id: 'yt-ce-slider', type: 'range',
      min: String(MIN), max: String(MAX), value: String(currentMin), step: '5' });
    slider.addEventListener('input', () => {
      currentMin = parseInt(slider.value);
      sliderVal.textContent = String(currentMin);
      if (comments.length) renderList();
    });

    const stats = el('div', { id: 'yt-ce-stats', txt: '—' });
    const list  = el('div', { id: 'yt-ce-list' });
    list.appendChild(emptyMsg('Click Fetch to load comments.'));
    const foot = el('div', { id: 'yt-ce-foot' });
    foot.appendChild(makeFetchBtn());

    const inner = el('div', { id: 'yt-ce-inner' },
      el('div', { id: 'yt-ce-head' },
        el('div', { id: 'yt-ce-title', txt: 'Comment Extractor' }),
        el('div', { id: 'yt-ce-slider-row' },
          el('span', { id: 'yt-ce-slider-lbl', txt: 'Min chars' }), slider, sliderVal),
        stats),
      list, foot);

    const tab = el('div', { id: 'yt-ce-tab', txt: '💬' });
    tab.addEventListener('click', () => {
      expanded = !expanded;
      card.classList.toggle('yt-ce-open', expanded);
    });

    const card = el('div', { id: CARD_ID }, tab, inner);
    document.documentElement.appendChild(card);
  }

  function tryBuild() {
    if (document.body) { buildCard(); return; }
    requestAnimationFrame(tryBuild);
  }
  tryBuild();

  // ─────────────────────────────────────────────
  // SCHEMA WARNING — shown in card + console when parsing looks off
  // ─────────────────────────────────────────────
  function showSchemaWarning(message) {
    console.warn('[YT-CE] ⚠ Schema issue detected:', message);
    console.warn('[YT-CE] The YouTube Innertube response format may have changed.');
    console.warn('[YT-CE] Open DevTools → Network → filter "next" → copy the response JSON');
    console.warn('[YT-CE] and ask AI to update the SCHEMA constants at the top of this script.');

    const list = document.getElementById('yt-ce-list');
    if (!list) return;
    // remove any existing warning
    const old = document.getElementById('yt-ce-warn');
    if (old) old.remove();

    const warn = el('div', { id: 'yt-ce-warn' });
    warn.appendChild(el('b', { txt: '⚠ Schema warning: ' }));
    warn.appendChild(document.createTextNode(message));
    warn.appendChild(document.createElement('br'));
    warn.appendChild(document.createTextNode(
      'YouTube may have changed their API format. Open DevTools → Network → find a "next" request → copy the response and ask AI to update the SCHEMA block at the top of the script.'
    ));
    list.parentNode.insertBefore(warn, list);
  }

  function clearSchemaWarning() {
    const old = document.getElementById('yt-ce-warn');
    if (old) old.remove();
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  function renderList() {
    const list  = document.getElementById('yt-ce-list');
    const stats = document.getElementById('yt-ce-stats');
    const foot  = document.getElementById('yt-ce-foot');
    if (!list) return;

    const sorted = [...comments].sort((a, b) => a.text.length - b.text.length);
    const below  = sorted.filter(c => c.text.length <  currentMin);
    const above  = sorted.filter(c => c.text.length >= currentMin);

    stats.textContent = '';
    stats.append(
      el('b', { txt: String(above.length) }), ' shown / ',
      el('b', { txt: String(comments.length) }), ' total · ',
      el('b', { txt: String(below.length) }), ' out'
    );

    list.textContent = '';
    below.forEach(c => list.appendChild(makeItem(c, true)));
    if (below.length) {
      list.appendChild(el('div', { cls: 'yt-ce-cut' },
        `▲ filtered · ${currentMin}c cutoff · ▼ included`));
    }
    if (!above.length) {
      list.appendChild(emptyMsg('Nothing passes — slide left.'));
    } else {
      above.forEach(c => list.appendChild(makeItem(c, false)));
    }

    const marker = list.querySelector('.yt-ce-cut');
    if (marker) setTimeout(() => marker.scrollIntoView({ block: 'start' }), 50);

    // footer
    foot.textContent = '';
    const copyBtn = el('button', { cls: 'yt-ce-fbtn yt-ce-red', txt: `Copy ${above.length} to clipboard` });
    copyBtn.addEventListener('click', () => doCopy(copyBtn, above.length));
    const refetch = el('button', { cls: 'yt-ce-fbtn yt-ce-grey', txt: 'Re-fetch' });
    refetch.addEventListener('click', () => {
      comments = [];
      clearSchemaWarning();
      list.textContent = ''; list.appendChild(emptyMsg('Click Fetch to load comments.'));
      stats.textContent = '—';
      foot.textContent = ''; foot.appendChild(makeFetchBtn());
      doFetch();
    });
    foot.appendChild(copyBtn);
    foot.appendChild(refetch);
  }

  function makeItem(c, dim) {
    let depthCls = '';
    if (c.replyLevel === 1) depthCls = ' yt-ce-reply';
    if (c.replyLevel >= 2) depthCls = ' yt-ce-subreply';

    const item = el('div', { cls: 'yt-ce-item' + depthCls + (dim ? ' yt-ce-dim' : '') });
    const meta = el('div', { cls: 'yt-ce-meta' },
      el('span', { cls: 'yt-ce-author', txt: c.author }));
    if (c.replyLevel >= 1) meta.appendChild(el('span', { cls: 'yt-ce-rtag', txt: c.replyLevel >= 2 ? '↳↳' : '↳' }));
    meta.appendChild(el('span', { cls: 'yt-ce-likes' + (c.likes > 0 ? ' hl' : ''),
                                   txt: c.likes > 0 ? '👍' + c.likes.toLocaleString() : '' }));
    meta.appendChild(el('span', { cls: 'yt-ce-len', txt: c.text.length + 'c' }));
    item.appendChild(meta);
    item.appendChild(el('div', { cls: 'yt-ce-text', txt: c.text }));
    return item;
  }

  // ─────────────────────────────────────────────
  // COPY
  // ─────────────────────────────────────────────
  function doCopy(btn, count) {
    const filtered = [...comments]
      .sort((a, b) => a.text.length - b.text.length)
      .filter(c => c.text.length >= currentMin);
    if (!filtered.length) { btn.textContent = 'Nothing to copy'; return; }

    const lines = filtered.map(c => {
      const indent = c.replyLevel >= 2 ? '    ↳↳ ' : c.replyLevel === 1 ? '  ↳ ' : '';
      return `${indent}[${c.author}]${c.likes > 0 ? ' 👍' + c.likes : ''}: ${c.text}`;
    });
    const out =
      `YouTube Comments — min ${currentMin}c — ${filtered.length}/${comments.length}\n` +
      `${'─'.repeat(58)}\n` +
      lines.join('\n\n');

    navigator.clipboard.writeText(out).catch(() => {
      const ta = Object.assign(document.createElement('textarea'), { value: out });
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    });
    btn.textContent = `✓ Copied ${filtered.length}`;
    btn.classList.add('ok');
    setTimeout(() => { btn.textContent = `Copy ${count} to clipboard`; btn.classList.remove('ok'); }, 2000);
  }

  // ─────────────────────────────────────────────
  // PAGE PARSER — uses SCHEMA constants above
  // Returns { newComments, next }
  // Logs loudly if schema expectations are not met
  // ─────────────────────────────────────────────
  function parsePage(data) {
    const newComments = [];
    let next = null;

    // ── Build entity map: commentKey → commentEntityPayload ──
    const entityMap = new Map();
    const mutations = SCHEMA.mutations(data);

    if (!mutations.length) {
      console.warn('[YT-CE] No mutations found in response. frameworkUpdates may be missing.');
    }

    for (const mutation of mutations) {
      const payload = SCHEMA.commentPayload(mutation);
      if (!payload) continue;
      const id = mutation.entityKey;
      if (id) entityMap.set(id, payload);
    }

    // ── Walk continuation items ──
    const items = SCHEMA.continuationItems(data);

    if (!items.length) {
      console.warn('[YT-CE] No continuation items found in onResponseReceivedEndpoints.');
    }

    let threadsFound = 0;
    let commentsExtracted = 0;
    let misses = 0;

    for (const item of items) {
      // next-page token
      const tok = SCHEMA.nextToken(item);
      if (tok) { next = tok; continue; }

      const thread = SCHEMA.threadRenderer(item);
      if (!thread) continue;
      threadsFound++;

      // extract this thread's comment
      extractFromThread(thread, entityMap, newComments, 0);

      // extract pre-loaded subThreads (inline replies)
      for (const sub of SCHEMA.subThreads(thread)) {
        const subThread = SCHEMA.threadRenderer(sub);
        if (subThread) extractFromThread(subThread, entityMap, newComments, 1);
      }
    }

    // ── Sanity check ──
    if (threadsFound > 0 && newComments.length === 0) {
      const msg = `Found ${threadsFound} thread(s) but extracted 0 comments. commentKey→entityKey join likely broken.`;
      showSchemaWarning(msg);
      console.error('[YT-CE] ⚠', msg);
      console.log('[YT-CE] Sample thread commentKey:', SCHEMA.commentKey(SCHEMA.threadRenderer(items.find(i => SCHEMA.threadRenderer(i)))));
      console.log('[YT-CE] Sample entityMap keys (first 3):', [...entityMap.keys()].slice(0, 3));
    }

    if (items.length > 0 && threadsFound === 0 && !next) {
      const msg = `Got ${items.length} continuation item(s) but found 0 commentThreadRenderers. Structure may have changed.`;
      showSchemaWarning(msg);
      console.error('[YT-CE] ⚠', msg);
      console.log('[YT-CE] Sample item keys:', Object.keys(items[0] || {}));
    }

    console.log(`[YT-CE] page: ${threadsFound} threads → ${newComments.length} comments, next=${!!next}`);
    return { newComments, next };
  }

  function extractFromThread(thread, entityMap, out, depthHint) {
    const key = SCHEMA.commentKey(thread);
    if (!key) return;

    const payload = entityMap.get(key);
    if (!payload) {
      console.warn('[YT-CE] commentKey not found in entityMap:', key?.slice(0, 40));
      return;
    }

    const text = SCHEMA.text(payload);
    if (!text) return; // skip empty

    out.push({
      author:     SCHEMA.author(payload),
      text,
      likes:      SCHEMA.likes(payload),
      replyLevel: SCHEMA.replyLevel(payload), // 0=top, 1=reply, 2=subreply
      commentId:  SCHEMA.commentId(payload),
    });
  }

  // ─────────────────────────────────────────────
  // FETCH
  // ─────────────────────────────────────────────
  async function doFetch() {
    fetching = true;
    clearSchemaWarning();
    const foot = document.getElementById('yt-ce-foot');
    const list = document.getElementById('yt-ce-list');

    foot.textContent = '';
    const statusBtn = el('button', { cls: 'yt-ce-fbtn yt-ce-red' });
    statusBtn.disabled = true;
    const setStatus = txt => {
      statusBtn.textContent = '';
      statusBtn.appendChild(el('span', { cls: 'yt-ce-sp' }));
      statusBtn.appendChild(document.createTextNode(txt));
    };
    setStatus('Fetching…');
    foot.appendChild(statusBtn);

    try {
      const vid = getVid();
      if (!vid) throw new Error('No video ID in URL.');

      const key = getKey();
      const ctx = getCtx();

      // First continuation token lives in ytInitialData
      const initData   = getYtInitialData();
      const firstToken = getFirstToken(initData);

      if (!firstToken) {
        throw new Error(
          'Comment continuation token not found in ytInitialData.\n' +
          'Try scrolling past the video description to trigger comment loading, then Re-fetch.\n' +
          'Also check the browser console for more detail.'
        );
      }

      comments = [];
      let token = firstToken;
      let page  = 0;

      while (token && page < 60) {
        page++;
        setStatus(`p${page} · ${comments.length}`);

        const data = await post(
          `https://www.youtube.com/youtubei/v1/next?key=${key}`,
          { context: ctx, continuation: token }
        );

        const { newComments, next } = parsePage(data);
        comments.push(...newComments);
        token = next;
        await sleep(150);
      }

      fetching = false;

      if (comments.length === 0) {
        const msg = 'Fetch completed but 0 comments extracted. The response schema may have changed — check the console for details.';
        showSchemaWarning(msg);
        list.textContent = '';
        list.appendChild(emptyMsg('0 comments extracted — see warning above.'));
        foot.textContent = ''; foot.appendChild(makeFetchBtn());
        return;
      }

      console.log(`[YT-CE] Done. ${comments.length} total comments.`);
      renderList();

    } catch (err) {
      fetching = false;
      foot.textContent = ''; foot.appendChild(makeFetchBtn());
      list.textContent = ''; list.appendChild(emptyMsg('Error: ' + err.message));
      console.error('[YT-CE] Fetch error:', err);
    }
  }

  // ─────────────────────────────────────────────
  // INNERTUBE HELPERS
  // ─────────────────────────────────────────────
  function getVid() {
    const v = new URLSearchParams(location.search).get('v');
    if (v) return v;
    const m = location.pathname.match(/\/shorts\/([^/?]+)/);
    return m ? m[1] : null;
  }

  function getKey() {
    for (const s of document.querySelectorAll('script')) {
      const m = s.textContent.match(/"INNERTUBE_API_KEY"\s*:\s*"([^"]+)"/);
      if (m) return m[1];
    }
    console.warn('[YT-CE] INNERTUBE_API_KEY not found in page scripts, using fallback.');
    return 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
  }

  function getCtx() {
    try {
      for (const s of document.querySelectorAll('script')) {
        const m = s.textContent.match(/ytcfg\.set\s*\(\s*(\{[\s\S]+?\})\s*\)/);
        if (m) {
          const c = JSON.parse(m[1]);
          if (c.INNERTUBE_CONTEXT) return c.INNERTUBE_CONTEXT;
        }
      }
    } catch (e) { console.warn('[YT-CE] Could not parse ytcfg:', e); }
    return { client: { clientName: 'WEB', clientVersion: '2.20260626.01.00', hl: 'en', gl: 'US' } };
  }

  function getYtInitialData() {
    for (const s of document.querySelectorAll('script')) {
      const t = s.textContent;
      const i = t.indexOf('ytInitialData');
      if (i === -1) continue;
      const start = t.indexOf('{', i);
      if (start === -1) continue;
      try {
        let depth = 0, end = start;
        for (; end < t.length; end++) {
          if (t[end] === '{') depth++;
          else if (t[end] === '}') { depth--; if (depth === 0) break; }
        }
        return JSON.parse(t.slice(start, end + 1));
      } catch {}
    }
    console.warn('[YT-CE] ytInitialData not found or unparseable.');
    return {};
  }

  function getFirstToken(initData) {
    try {
      const contents = initData?.contents?.twoColumnWatchNextResults?.results?.results?.contents ?? [];
      for (const c of contents) {
        const t = c?.itemSectionRenderer?.contents?.[0]
          ?.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
        if (t) return t;
      }
    } catch (e) { console.warn('[YT-CE] Error extracting first token:', e); }
    console.warn('[YT-CE] First token not found via standard path. ytInitialData structure:',
      Object.keys(initData?.contents ?? {}));
    return null;
  }

  function post(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(r => r.json());
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ─────────────────────────────────────────────
  // SPA RESET
  // ─────────────────────────────────────────────
  new MutationObserver(() => {
    const vid = getVid();
    if (!vid || vid === lastVid) return;
    lastVid = vid;
    if (fetching) return;
    comments = [];
    clearSchemaWarning();
    const list  = document.getElementById('yt-ce-list');
    const stats = document.getElementById('yt-ce-stats');
    const foot  = document.getElementById('yt-ce-foot');
    if (!list) return;
    list.textContent = ''; list.appendChild(emptyMsg('New video — click Fetch.'));
    stats.textContent = '—';
    foot.textContent = ''; foot.appendChild(makeFetchBtn());
  }).observe(document.documentElement, { childList: true, subtree: false });

})();
