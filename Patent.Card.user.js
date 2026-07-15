// ==UserScript==
// @name         PatentX – Search Card Grid
// @namespace    http://tampermonkey.net/
// @version      1.9.0
// @description  Reflows Google Patents search-results (the inventor/assignee/keyword list view) from a single vertical column into a scannable card masonry, with reading-mode typography and frivolous-chrome toggles. Click a card to fetch its full record inline (Google's own internal /xhr/result endpoint, called directly) and browse it as tabbed sub-cards -- Info, Description, Claims, Images, Classifications, Definitions, Landscapes -- so what's available is visible at a glance instead of one long scroll. Pure CSS/DOM reflow — nothing deleted or rewritten, so unchecking every toggle reproduces stock Google Patents.
// @match        *://patents.google.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  // ArrowGraph already owns the single-patent reading page; this script is
  // only about the search-RESULTS list (search-result-item cards), which
  // lives at the bare host with query params, never under /patent/.
  if (location.pathname.startsWith('/patent/')) return;

  const VERSION = '1.9.0';
  const TAG = '[PCG]';
  const log  = (...a) => console.log  ('%c' + TAG, 'color:#0d904f;font-weight:bold', ...a);
  const warn = (...a) => console.warn ('%c' + TAG, 'color:#b8860b;font-weight:bold', ...a);
  const err  = (...a) => console.error('%c' + TAG, 'color:#c0392b;font-weight:bold', ...a);

  // ─── Visible failure banner ────────────────────────────────────────────
  // console.warn/error alone is invisible unless devtools is already open --
  // this mirrors ArrowGraph's fail banner so a broken selector, a failed
  // tap, or an unexpected exception surfaces on the page itself, not just in
  // a console nobody's watching. Amber = degraded-but-working (contract
  // violation), red = an actual exception got thrown somewhere. Repeating
  // the exact same message flashes the existing line instead of stacking
  // duplicates.
  let banner = null;
  function ensureBanner() {
    if (banner && document.body && document.body.contains(banner)) return banner;
    if (!document.body) return null;
    banner = document.createElement('div');
    banner.id = 'pcg-fail-banner';
    document.body.prepend(banner);
    return banner;
  }
  function pushBanner(msg, kind) {
    const b = ensureBanner();
    if (!b) { setTimeout(() => pushBanner(msg, kind), 50); return; } // body not ready yet at document-start
    const flashClass = kind === 'warn' ? 'pcg-warn-flash' : 'pcg-fail-flash';
    const top = b.firstElementChild;
    if (top && top.dataset.msg === msg) {
      top.classList.remove(flashClass);
      void top.offsetWidth;
      top.classList.add(flashClass);
      return;
    }
    const line = document.createElement('div');
    line.className = kind === 'warn' ? 'pcg-warn-line' : 'pcg-fail-line';
    line.dataset.msg = msg;
    line.innerHTML = `<span class="pcg-banner-text"></span><span class="pcg-banner-close" title="Dismiss">✕</span>`;
    line.querySelector('.pcg-banner-text').textContent = '[PatentX Card Grid] ' + msg;
    line.querySelector('.pcg-banner-close').addEventListener('click', () => line.remove());
    b.prepend(line);
  }

  // One bad node/mutation logs loudly (with a name to grep for), shows a
  // visible red banner line, and gets skipped -- instead of throwing
  // uncaught and silently aborting whatever loop or observer callback it
  // was called from.
  function guard(name, fn) {
    return (...a) => {
      try { return fn(...a); }
      catch (e) {
        err(name, 'threw:', e);
        pushBanner(`Unexpected error in ${name} — ${(e && e.message) || e}`, 'fail');
      }
    };
  }

  // Every selector below is a claim about Google Patents' current markup.
  // Unlike LinkedIn's hashed atomic classes, Google Patents (Polymer/Shady
  // DOM) ships stable, semantic class names (.metadata, .dates, .thumbnail,
  // search-result-item), confirmed by reading a live search-results page
  // snapshot — but "stable so far" isn't "guaranteed forever". If one of
  // these stops matching, violate() makes that loud (console AND banner)
  // instead of the feature just quietly doing nothing.
  const contractViolations = new Set();
  function violate(name, details) {
    const key = name + ':' + details;
    if (contractViolations.has(key)) return;
    contractViolations.add(key);
    warn('CONTRACT VIOLATION --', name, '--', details);
    pushBanner(`${name} — ${details}`, 'warn');
  }

  // ─── Settings ────────────────────────────────────────────────────────────
  // One JSON blob in storage, shared across every patents.google.com tab.
  // Every feature is a class on <html>; toggling never touches Google's own
  // DOM, only which CSS rules match.

  const DEFAULTS = {
    grid:         true, // card masonry instead of one vertical column
    reskin:       true, // reading typography, calm background, compact badges
    hideDownload: true, // hide the CSV/XLSX/SPIF export dropdown
    hideChart:    true, // hide the "Top assignees/inventors/filing date" widget
  };

  const LABELS = {
    grid:         'Card masonry instead of single-column list',
    reskin:       'Reading-mode typography & compact badges',
    hideDownload: 'Hide the CSV/XLSX export dropdown',
    hideChart:    'Hide "Top assignees / inventors / filing date" widget',
  };

  function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }
  const state = Object.assign({}, DEFAULTS, safeParse(GM_getValue('pcg-settings', '{}')));
  function save() { GM_setValue('pcg-settings', JSON.stringify(state)); }

  function applyClasses() {
    const cl = document.documentElement.classList;
    for (const k of Object.keys(DEFAULTS)) cl.toggle('pcg-' + k, !!state[k]);
  }
  applyClasses();

  // ─── Stylesheet ──────────────────────────────────────────────────────────
  // Selectors key off Google's own semantic class names and custom element
  // tag names — confirmed against a live search-results page rather than
  // guessed. Everything is !important because Google's Shady-DOM-scoped
  // rules (e.g. ".metadata.search-result-item") already carry real
  // specificity of their own.

  GM_addStyle(`
    /* ─ Visible failure banner (see ensureBanner/pushBanner above) */
    #pcg-fail-banner {
      position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647;
      display: flex; flex-direction: column; pointer-events: none;
    }
    .pcg-fail-line, .pcg-warn-line {
      pointer-events: auto; position: relative;
      font: 700 12px/1.6 -apple-system, "Segoe UI", sans-serif;
      padding: 8px 36px 8px 14px; white-space: pre-wrap; word-break: break-word;
    }
    .pcg-fail-line { background: #3f0000; color: #fca5a5; border-bottom: 2px solid #ef4444; }
    .pcg-warn-line { background: #3f2200; color: #fde68a; border-bottom: 2px solid #eab308; }
    .pcg-banner-close { position: absolute; top: 6px; right: 12px; cursor: pointer; font-size: 14px; }
    .pcg-fail-line.pcg-fail-flash { animation: pcg-fail-flash 0.4s ease 2; }
    .pcg-warn-line.pcg-warn-flash { animation: pcg-warn-flash 0.4s ease 2; }
    @keyframes pcg-fail-flash { 0%, 100% { background: #3f0000; } 50% { background: #7f1d1d; } }
    @keyframes pcg-warn-flash { 0%, 100% { background: #3f2200; } 50% { background: #7c4a03; } }

    /* ─ Grid: CSS multi-column masonry. Reverted back from a brief CSS-Grid
       experiment (repeat(auto-fill, minmax) + align-items:start) that
       traded masonry's minor column-balance imperfection for grid's own
       row-height coupling (a short card sitting in the same row as a tall
       one gets its own dead space below it too) -- not a clear win, and it
       was solving a smaller cosmetic issue than the width bugs above, which
       were the actual defects. Multi-column needs no JS measurement for
       uneven card heights, at the cost of occasionally imperfect column
       balancing when cards are break-inside:avoid (indivisible) blocks. */
    /* #main is a flex item of its own parent (.layout.horizontal, search-ui
       scope) one level further up the tree than #resultsLayout below.
       Google's own CSS gives it display:block and a min-height but never
       adds the .flex utility class (confirmed: #main's own class list is
       just "style-scope search-ui") -- so it defaults to flex-grow:0 and
       sits at content width while the row around it is already full width.
       Same fight as #resultsContainer vs. #rightResult below, one level up. */
    html.pcg-grid #main { flex: 1 1 auto !important; width: auto !important; }
    html.pcg-grid #resultsLayout { width: 100% !important; max-width: none !important; }
    html.pcg-grid #resultsContainer {
      max-width: 1600px !important;
      margin: 0 auto !important;
      /* #resultsContainer is one of two flex children of #resultsLayout
         (row layout in "wide" mode) — its sibling is #rightResult, the
         Top-assignees/inventors chart panel. Widening #resultsLayout alone
         does nothing if that sibling is still claiming its own share of the
         row; it has to actually be collapsed (below) for this to grow into
         the freed space. */
      flex: 1 1 auto !important;
      width: auto !important;
    }
    /* Confirmed via ui3.html: #rightResult holds nothing but <summary-box>
       (the chart widget) — safe to collapse outright rather than just
       hiding its contents, which would leave an empty flex box still
       reserving width. */
    html.pcg-grid #rightResult {
      display: none !important;
      flex: 0 0 0 !important;
      width: 0 !important;
    }
    /* Confirmed via ui3.html (.search-results-0 section.search-results):
       Google caps this exact element at max-width:750px on its own,
       independent of #resultsLayout/#resultsContainer/#main/#rightResult
       above. That's the actual root cause of both "doesn't extend to the
       right" and "too much grey space" -- at column-width:340px, 750px
       only ever fits ~2 columns, leaving everything past that width (now
       that the ancestors ARE full width) as dead grey space. None of the
       ancestor fixes above touch this; it needed its own override. */
    html.pcg-grid section.style-scope.search-results {
      display: block !important;
      max-width: none !important;
      column-width: 340px !important;
      column-gap: 20px !important;
    }
    /* The per-section header/spacer divs aren't information, they're
       layout scaffolding for the old single-column list — hiding them
       (rather than trying to lay them out sanely in a column flow) is the
       "no frivolous chrome" default this whole script is built around. */
    html.pcg-grid section.style-scope.search-results > div.padding,
    html.pcg-grid section.style-scope.search-results > header {
      display: none !important;
    }
    /* Also confirmed via ui3.html: search-result-item itself carries
       Google's own padding:0 20px 27px 20px (list-row spacing for the old
       single-column layout) plus display:flex -- left alone, that's a
       redundant inset stacking on top of article.result's own card
       padding below, and a stray flex context around the whole card. */
    html.pcg-grid search-result-item {
      display: block !important;
      padding: 0 !important;
      margin: 0 0 20px 0 !important;
      break-inside: avoid !important;
      -webkit-column-break-inside: avoid !important;
    }
    html.pcg-grid search-result-item article.result {
      height: auto !important;
      margin: 0 !important;
    }

    /* ─ Reskin: reading typography + compact metadata, same palette as
       LinkedIn Insight Mode for visual consistency across these tools. */
    html.pcg-reskin #resultsLayout,
    html.pcg-reskin #resultsContainer {
      background: #f6f4ef !important;
    }
    html.pcg-reskin search-result-item article.result {
      background: #fffdf9 !important;
      border: 1px solid #e4e0d5 !important;
      border-radius: 10px !important;
      padding: 16px 18px !important;
      font-family: Charter, Georgia, "Iowan Old Style", serif !important;
    }
    html.pcg-reskin .result-title.search-result-item { text-decoration: none !important; }
    html.pcg-reskin .result-title.search-result-item h3 {
      font-size: 16px !important;
      line-height: 1.35 !important;
      font-weight: 700 !important;
      color: #1a1d27 !important;
      margin: 0 0 8px 0 !important;
    }
    html.pcg-reskin .result-title.search-result-item:hover h3 {
      color: #0d904f !important;
      text-decoration: underline !important;
    }
    html.pcg-reskin div.abstract.layout.horizontal.start.search-result-item {
      align-items: flex-start !important;
      gap: 10px !important;
    }
    html.pcg-reskin .figureViewButtonWrap.search-result-item { flex-shrink: 0 !important; }
    html.pcg-reskin img.thumbnail.search-result-item {
      width: 72px !important;
      height: 72px !important;
      object-fit: contain !important;
      border: 1px solid #e4e0d5 !important;
      border-radius: 6px !important;
      background: #fff !important;
      margin: 0 !important;
    }
    html.pcg-reskin h4.metadata.search-result-item {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 2px 0 !important;
      font-size: 11px !important;
      font-family: -apple-system, sans-serif !important;
      margin: 0 0 4px 0 !important;
    }
    html.pcg-reskin h4.metadata.search-result-item span.active,
    html.pcg-reskin h4.metadata.search-result-item span.not_active,
    html.pcg-reskin h4.metadata.search-result-item span.unknown {
      display: inline-block !important;
      padding: 1px 5px !important;
      margin: 0 2px 2px 0 !important;
      border-radius: 3px !important;
      background: #eef0e8 !important;
      font-size: 10px !important;
    }
    html.pcg-reskin h4.metadata.search-result-item span.active { background: #e3f3ea !important; color: #0d904f !important; }
    html.pcg-reskin h4.metadata.search-result-item span.not_active { opacity: .5 !important; }
    html.pcg-reskin h4.dates.search-result-item {
      font-size: 11px !important;
      font-family: -apple-system, sans-serif !important;
      margin: 0 0 8px 0 !important;
    }
    /* The bare abstract-snippet raw-html is a direct child of the .flex
       column that also holds h4.metadata/h4.dates — targeting it via the
       direct-child combinator avoids also catching the title's own
       raw-html, which is nested one level deeper inside h3. */
    html.pcg-reskin div.flex.style-scope.search-result-item > raw-html {
      font-size: 14px !important;
      line-height: 1.55 !important;
      color: #2b2b2b !important;
    }

    /* ─ Inline expand: click a card's text to fetch its full record (via
       /xhr/result, same one Google's own "open result" click uses) and read
       it right there in the grid. Capped height + internal scroll rather
       than letting the card grow to the description's full length, which
       for a modern patent can be thousands of words. */
    html.pcg-grid search-result-item article.result { cursor: pointer !important; }
    .pcg-expand {
      margin-top: 10px !important;
      padding-top: 10px !important;
      border-top: 1px solid #e4e0d5 !important;
      max-height: 420px !important;
      overflow-y: auto !important;
      font-size: 14px !important;
      line-height: 1.6 !important;
      color: #2b2b2b !important;
      cursor: auto !important;
    }
    .pcg-expand .pcg-expand-status { color: #6b7280 !important; font-style: italic !important; }
    .pcg-expand .pcg-expand-error { color: #b8860b !important; }
    .pcg-expand .pcg-expand-error a { color: #0d904f !important; }
    .pcg-hidden { display: none !important; }

    /* Sub-cards: every parsed section (Info/Images/Classifications/
       Definitions/Description/Claims/Landscapes) gets its own tab, so
       what's actually available -- and how much -- is visible at a glance
       instead of scrolling through one long blob to find out. */
    .pcg-tab-bar {
      position: sticky !important; top: 0 !important; z-index: 1 !important;
      display: flex !important; flex-wrap: wrap !important; gap: 4px !important;
      background: #fffdf9 !important; padding-bottom: 8px !important; margin-bottom: 8px !important;
    }
    .pcg-tab {
      font: 600 11px/1.4 -apple-system, sans-serif !important;
      padding: 4px 9px !important; border-radius: 12px !important;
      border: 1px solid #e4e0d5 !important; background: #f6f4ef !important;
      color: #4b4b4b !important; cursor: pointer !important;
    }
    .pcg-tab.pcg-tab-active { background: #0d904f !important; border-color: #0d904f !important; color: #fff !important; }
    .pcg-tab-count { opacity: .75 !important; }

    /* Google's own description markup wraps reference-numeral mentions in
       <figure-callout> tags (confirmed via fetch4.txt) linking prose to a
       specific figure + label -- an unstyled custom element renders inline
       by default, so this just makes them visibly distinct rather than
       building the full click-to-highlight-the-diagram interaction yet. */
    .pcg-expand figure-callout { border-bottom: 1px dotted #0d904f; }
    .pcg-expand div.claim { margin: 0 0 10px !important; }
    .pcg-expand div.claim-dependent { margin: 0 0 10px 18px !important; color: #4b4b4b !important; }

    .pcg-abstract { font-style: italic !important; color: #4b4b4b !important; margin-bottom: 12px !important; padding-bottom: 10px !important; border-bottom: 1px dashed #e4e0d5 !important; }

    /* Subtabs: second-level tab bar, currently only used inside the
       Description panel (real <heading> markup -- "SUMMARY OF THE
       INVENTION" etc. -- confirmed via fetch4.txt), scoped to whichever
       .pcg-tab-panel they were rendered into. Visually distinct from the
       top-level .pcg-tab pills (square-ish, outline style) so it's clear
       these are a nested level, not more top-level sections. */
    .pcg-subtab-bar { display: flex !important; flex-wrap: wrap !important; gap: 4px !important; margin-bottom: 10px !important; }
    .pcg-subtab {
      font: 600 11px/1.4 -apple-system, sans-serif !important;
      padding: 3px 8px !important; border-radius: 4px !important;
      border: 1px solid #0d904f !important; background: transparent !important;
      color: #0d904f !important; cursor: pointer !important;
    }
    .pcg-subtab.pcg-subtab-active { background: #0d904f !important; color: #fff !important; }

    .pcg-info-row { display: flex !important; gap: 10px !important; padding: 4px 0 !important; border-bottom: 1px solid #f0ede3 !important; }
    .pcg-info-label { flex: 0 0 140px !important; font-weight: 700 !important; color: #6b7280 !important; font-size: 12px !important; }
    .pcg-info-value { flex: 1 !important; }
    .pcg-info h6, .pcg-expand h6 { margin: 14px 0 6px !important; font: 700 11px/1 -apple-system, sans-serif !important; text-transform: uppercase !important; letter-spacing: .05em !important; color: #0d904f !important; }
    .pcg-timeline-row { display: flex !important; gap: 10px !important; padding: 3px 0 !important; font-size: 13px !important; }
    .pcg-timeline-row.pcg-critical { font-weight: 600 !important; }
    .pcg-timeline-date { flex: 0 0 90px !important; color: #6b7280 !important; font-size: 12px !important; }

    .pcg-image-grid { display: flex !important; flex-wrap: wrap !important; gap: 8px !important; }
    .pcg-image-cell { display: block !important; width: 84px !important; height: 84px !important; border: 1px solid #e4e0d5 !important; border-radius: 6px !important; overflow: hidden !important; background: #fff !important; }
    .pcg-image-cell img { width: 100% !important; height: 100% !important; object-fit: contain !important; }
    /* Hover preview: one singleton overlay (see bindImageHoverPreview),
       shown centered over the whole page rather than positioned relative
       to the tiny 84px thumbnail, since the full-size figure can be much
       larger than the space around any given thumbnail. */
    #pcg-image-preview {
      position: fixed; inset: 0; z-index: 2147483647; display: none;
      align-items: center; justify-content: center;
      background: rgba(20, 20, 15, .75); pointer-events: none;
    }
    #pcg-image-preview img { max-width: 80vw; max-height: 80vh; background: #fff; border-radius: 6px; box-shadow: 0 8px 40px rgba(0,0,0,.5); }

    /* Classifications: a real merged tree (see buildClassificationTree) --
       shared ancestors between chains render once, branching only where
       chains actually diverge, instead of repeating the full breadcrumb
       per chain. <details>/<summary> gives free collapse/expand with zero
       JS; defaults open since "see the whole hierarchy at a glance" is the
       point, but a deep/uninteresting branch can be collapsed by hand. */
    .pcg-cpc-tree { font-size: 13px !important; }
    .pcg-cpc-node, .pcg-cpc-leaf { margin: 2px 0 !important; }
    .pcg-cpc-node > summary { cursor: pointer !important; }
    .pcg-cpc-node > summary::-webkit-details-marker { color: #b0aa98 !important; }
    .pcg-cpc-node .pcg-cpc-children { margin-left: 14px !important; border-left: 1px dotted #d8d2c2 !important; padding-left: 10px !important; }
    .pcg-cpc-chip { font: 600 11px monospace !important; background: #eef0e8 !important; padding: 1px 6px !important; border-radius: 3px !important; }
    .pcg-cpc-desc { color: #4b4b4b !important; }

    .pcg-def-row { margin-bottom: 8px !important; }
    .pcg-def-subject { font-weight: 700 !important; color: #1a1d27 !important; }

    .pcg-landscape-tags { display: flex !important; flex-wrap: wrap !important; gap: 6px !important; }
    .pcg-landscape-tag { font: 600 11px -apple-system, sans-serif !important; background: #e3f3ea !important; color: #0d904f !important; padding: 3px 9px !important; border-radius: 12px !important; }

    /* ─ Frivolous-chrome toggles */
    html.pcg-hideDownload #count.search-results .headerButton { display: none !important; }
    /* Collapse the whole flex box, not just the chart inside it — see the
       #rightResult comment under the grid rules above for why. This lets
       hideChart alone (grid off) also reclaim that width for the
       single-column list. */
    html.pcg-hideChart #rightResult { display: none !important; flex: 0 0 0 !important; width: 0 !important; }

    /* ─ Settings panel (bottom-left, matching LinkedIn Insight Mode) */
    #pcg-panel { position: fixed; z-index: 2147483647; left: 16px; bottom: 16px; font-family: -apple-system, sans-serif; }
    #pcg-toggle { width: 40px; height: 40px; border-radius: 50%; border: none; background: #0d904f; color: #fff; font-size: 18px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.25); }
    #pcg-body { position: absolute; bottom: 48px; left: 0; width: 320px; background: #fff; color: #222; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,.3); padding: 16px; max-height: 70vh; overflow-y: auto; }
    #pcg-body h3 { margin: 0 0 8px; font-size: 15px; }
    #pcg-body .pcg-note { font-size: 12px; color: #666; margin: 0 0 12px; line-height: 1.4; }
    #pcg-body label { display: block; font-size: 13px; margin: 6px 0; cursor: pointer; }
  `);

  // ─── Panel ────────────────────────────────────────────────────────────────

  function buildPanel() {
    if (document.getElementById('pcg-panel')) return;
    if (window.top !== window.self) return;

    const panel = document.createElement('div');
    panel.id = 'pcg-panel';
    panel.innerHTML = `
      <button id="pcg-toggle" title="PatentX Card Grid settings">◐</button>
      <div id="pcg-body" hidden>
        <h3>Card Grid</h3>
        <p class="pcg-note">Pure CSS reflow of the search results list — nothing is deleted or sent anywhere.
        Uncheck an item (or all of them) and reload for stock Google Patents.</p>
        ${Object.keys(DEFAULTS).map(k => `
          <label><input type="checkbox" data-k="${k}" ${state[k] ? 'checked' : ''}> ${LABELS[k]}</label>
        `).join('')}
      </div>
    `;
    (document.body || document.documentElement).appendChild(panel);
    log('panel attached');

    panel.querySelector('#pcg-toggle').addEventListener('click', guard('panel-toggle', () => {
      const body = panel.querySelector('#pcg-body');
      body.hidden = !body.hidden;
    }));
    panel.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', guard('checkbox-change', () => {
        state[cb.dataset.k] = cb.checked;
        save();
        applyClasses();
        log('toggled', cb.dataset.k, '->', cb.checked);
      }));
    });
  }

  // ─── Inline expand ──────────────────────────────────────────────────────
  // Click a card (grid mode only) to fetch its full record and read it right
  // there, capped/scrollable — the same interaction LinkedIn Insight Mode
  // uses to expand a feed card, except the content isn't already in the DOM
  // here, so the first click also triggers a fetch.
  //
  // /xhr/result?id=<patent id>&qs=<encoded search query> is Google's own
  // internal endpoint for one full patent record as clean schema.org
  // microdata (confirmed via fetch4.txt). Earlier versions of this script
  // patched fetch/XMLHttpRequest to *observe* a real call and replay its
  // headers, on the assumption its x-browser-validation header was some
  // kind of session token. Verified directly (a stripped-down request with
  // NO custom headers and no `peid` still returned a real 200 with the full
  // description) that assumption was wrong -- x-browser-channel/copyright/
  // year are hardcoded constants, x-browser-validation isn't checked for
  // this endpoint, sec-ch-ua*/sec-fetch-*/accept-language are browser-
  // managed headers JS can't set anyway, and peid isn't required either. So
  // there's nothing to tap: just build the request straight from what's
  // already on the page (the card's own data-result id, and the current
  // page's own search query for `qs`).

  const resultCache = new Map(); // patent id ("patent/US.../en") -> raw HTML string

  // Parses the /xhr/result HTML into distinct sub-cards instead of one long
  // scroll -- confirmed via fetch4.txt/parseq.txt that every section keys
  // off consistent schema.org itemprops regardless of which fields a given
  // patent actually has (a 1936 patent may have no Claims at all, e.g.),
  // so this reads what exists rather than assuming a fixed shape.
  function escHtml(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function parseRecord(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = (el) => el ? el.textContent.trim() : '';
    const content = (prop) => {
      const el = doc.querySelector(`[itemprop="${prop}"] [itemprop="content"]`);
      return el ? el.innerHTML : '';
    };

    // Confirmed via fetch4.txt: itemprop="assigneeOriginal" appears 371
    // times in one record -- ONE is the actual patent's own Info field, the
    // other 370 are per-row assignee cells inside the "Cited By" table
    // further down (same schema reused for every patent mentioned anywhere
    // in the response, including citing/cited/family/similar ones). An
    // unscoped querySelectorAll was joining all of them together, which is
    // what actually bloated the Original Assignee field -- most of those
    // names are genuinely different companies from unrelated citing
    // patents, not the same company restated in different scripts. Every
    // Info-only field (inventor/assignee/keywords/events) is scoped to
    // elements appearing before the first itemprop="links" element, which
    // is where the real Info section ends and the citation/family tables
    // begin. Deliberately NOT matched by the "Links" heading's display
    // text -- that would silently break (reverting to the exact unscoped
    // bloat bug above, with no warning) if Google ever changes that text or
    // localizes it. itemprop="links" is Google's own schema-level contract
    // for that boundary, not a display string we're guessing meaning from.
    // If even that's missing, don't silently fall back -- violate() so a
    // broken assumption is visible instead of quietly reintroducing bloat.
    const linksBoundary = doc.querySelector('[itemprop="links"]');
    if (!linksBoundary) violate('info scoping boundary', 'no [itemprop="links"] element found in this /xhr/result record -- Info fields could not be scoped to just this patent and may include data pulled in from citation/family tables further down');
    const beforeLinks = (el) => !linksBoundary || !!(linksBoundary.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING);

    const info = { fields: [], events: [] };
    const addField = (label, sel, joinAll) => {
      const matches = Array.from(doc.querySelectorAll(sel)).filter(beforeLinks);
      if (joinAll) {
        const vals = matches.map(text).filter(Boolean);
        if (vals.length) info.fields.push({ label, value: vals.join(', ') });
      } else {
        const v = text(matches[0]);
        if (v) info.fields.push({ label, value: v });
      }
    };
    addField('Inventor', '[itemprop="inventor"]', true);
    addField('Current Assignee', '[itemprop="assigneeCurrent"]', true);
    addField('Original Assignee', '[itemprop="assigneeOriginal"]', true);
    addField('Application number', '[itemprop="applicationNumber"]');
    addField('Priority date', '[itemprop="priorityDate"]');
    addField('Filing date', '[itemprop="filingDate"]');
    addField('Publication date', '[itemprop="publicationDate"]');
    addField('Legal status', '[itemprop="legalStatusIfi"] [itemprop="status"]');
    addField('Prior art keywords', '[itemprop="priorArtKeywords"]', true);
    Array.from(doc.querySelectorAll('[itemprop="events"]')).filter(beforeLinks).forEach(ev => {
      const title = text(ev.querySelector('[itemprop="title"]'));
      if (title) info.events.push({ date: text(ev.querySelector('[itemprop="date"]')), title, critical: !!ev.querySelector('[itemprop="critical"]') });
    });

    const images = Array.from(doc.querySelectorAll('li[itemprop="images"]')).map(li => ({
      thumb: li.querySelector('[itemprop="thumbnail"]')?.getAttribute('src') || '',
      full: li.querySelector('[itemprop="full"]')?.getAttribute('content') || '',
      callouts: Array.from(li.querySelectorAll('[itemprop="callouts"]')).map(c => text(c.querySelector('[itemprop="label"]'))).filter(Boolean),
    })).filter(im => im.thumb);

    // Each <ul itemprop="classifications"> is one root-to-leaf CPC chain;
    // its direct <li> children are that chain's levels, broad to specific.
    const classifications = Array.from(doc.querySelectorAll('ul[itemprop="classifications"]'))
      .map(chain => Array.from(chain.querySelectorAll(':scope > li[itemprop="classifications"]')).map(li => ({
        code: text(li.querySelector('[itemprop="Code"]')),
        description: text(li.querySelector('[itemprop="Description"]')),
      })))
      .filter(chain => chain.length);

    const definitions = Array.from(doc.querySelectorAll('li[itemprop="definitions"]')).map(li => ({
      subject: text(li.querySelector('[itemprop="subject"]')),
      definition: text(li.querySelector('[itemprop="definition"]')),
    })).filter(d => d.subject);

    const landscapes = Array.from(doc.querySelectorAll('li[itemprop="landscapes"]')).map(li => ({
      name: text(li.querySelector('[itemprop="name"]')),
    })).filter(l => l.name);

    return { info, images, classifications, definitions, landscapes, abstract: content('abstract'), description: content('description'), claims: content('claims') };
  }

  // Modern patents mark Description section breaks with a real <heading>
  // element (confirmed via fetch4.txt -- "FIELD OF THE INVENTION",
  // "BACKGROUND OF THE INVENTION", "SUMMARY OF THE INVENTION", "DESCRIPTION
  // OF THE FIGURES", "DETAILED DESCRIPTION", each a sibling immediately
  // before the description-paragraph divs that belong to it), not just
  // ALL-CAPS text needing a heuristic. Splits the description into actual
  // sections along those boundaries; a patent with none (e.g. parseq.txt,
  // 1936, predates this convention) just comes back as one section.
  function splitDescriptionSections(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    // Google wraps the whole description in an extra div (itemprop=content
    // > div.description > [heading, description-paragraph, ...]) -- the
    // heading/paragraph siblings are NOT direct children of what we just
    // parsed, they're one level deeper inside that wrapper div. Rather
    // than hardcode "one level deeper" (fragile if Google ever adds or
    // removes a wrapping layer), find a real <heading> and walk from ITS
    // actual parent, whatever depth that turns out to be. No heading found
    // at all (patents predating this convention) falls back to wrapper
    // itself, which just produces a single unsplit section.
    const anyHeading = wrapper.querySelector('heading');
    const container = anyHeading ? anyHeading.parentElement : wrapper;
    const sections = [{ title: '', html: '' }];
    Array.from(container.children).forEach(el => {
      if (el.tagName.toLowerCase() === 'heading') {
        sections.push({ title: el.textContent.trim(), html: '' });
      } else {
        sections[sections.length - 1].html += el.outerHTML;
      }
    });
    return sections.filter(s => s.title || s.html.trim());
  }

  const TAB_ORDER = ['info', 'description', 'claims', 'images', 'classifications', 'definitions', 'landscapes'];
  const TAB_LABELS = { info: 'Info', description: 'Description', claims: 'Claims', images: 'Images', classifications: 'Classifications', definitions: 'Definitions', landscapes: 'Landscapes' };

  function tabCount(record, key) {
    switch (key) {
      case 'images': return record.images.length;
      case 'classifications': return record.classifications.length;
      case 'definitions': return record.definitions.length;
      case 'landscapes': return record.landscapes.length;
      default: return null;
    }
  }
  function tabHasContent(record, key) {
    switch (key) {
      case 'info': return record.info.fields.length > 0;
      case 'description': return !!(record.description || record.abstract);
      case 'claims': return !!record.claims;
      default: return (tabCount(record, key) || 0) > 0;
    }
  }

  function renderInfoPanel(record) {
    const rows = record.info.fields.map(f => `<div class="pcg-info-row"><div class="pcg-info-label">${escHtml(f.label)}</div><div class="pcg-info-value">${escHtml(f.value)}</div></div>`).join('');
    const events = record.info.events.length
      ? `<h6>Timeline</h6><div class="pcg-timeline">${record.info.events.map(e => `<div class="pcg-timeline-row${e.critical ? ' pcg-critical' : ''}"><span class="pcg-timeline-date">${escHtml(e.date)}</span><span>${escHtml(e.title)}</span></div>`).join('')}</div>`
      : '';
    return `<div class="pcg-info">${rows}</div>${events}`;
  }
  function renderImagesPanel(record) {
    return `<div class="pcg-image-grid">${record.images.map(im => `<a class="pcg-image-cell" href="${escHtml(im.full || im.thumb)}" target="_blank" rel="noopener" title="${escHtml(im.callouts.slice(0, 6).join(', '))}"><img src="${escHtml(im.thumb)}" loading="lazy"></a>`).join('')}</div>`;
  }
  // The chains parsed out of Classifications overlap heavily -- e.g. two
  // separate chains both starting "H›H01›H01S›H01S5/00›H01S5/30›..." were
  // being printed as two full, mostly-identical breadcrumb strings. A real
  // tree (merging shared ancestors, branching only where chains actually
  // diverge) shows the same information without repeating the common
  // prefix once per chain.
  function buildClassificationTree(chains) {
    const root = { children: new Map() };
    chains.forEach(chain => {
      let node = root;
      chain.forEach(level => {
        if (!node.children.has(level.code)) node.children.set(level.code, { label: level, children: new Map() });
        node = node.children.get(level.code);
      });
    });
    return root;
  }
  function renderClassificationNode(node) {
    return Array.from(node.children.values()).map(child => {
      const label = `<span class="pcg-cpc-chip" title="${escHtml(child.label.code)}">${escHtml(child.label.code)}</span> <span class="pcg-cpc-desc">${escHtml(child.label.description)}</span>`;
      if (!child.children.size) return `<div class="pcg-cpc-leaf">${label}</div>`;
      return `<details class="pcg-cpc-node" open><summary>${label}</summary><div class="pcg-cpc-children">${renderClassificationNode(child)}</div></details>`;
    }).join('');
  }
  function renderClassificationsPanel(record) {
    return `<div class="pcg-cpc-tree">${renderClassificationNode(buildClassificationTree(record.classifications))}</div>`;
  }
  function renderDefinitionsPanel(record) {
    return record.definitions.map(d => `<div class="pcg-def-row"><span class="pcg-def-subject">${escHtml(d.subject)}</span> — ${escHtml(d.definition)}</div>`).join('');
  }
  function renderLandscapesPanel(record) {
    return `<div class="pcg-landscape-tags">${record.landscapes.map(l => `<span class="pcg-landscape-tag">${escHtml(l.name)}</span>`).join('')}</div>`;
  }
  function renderDescriptionPanel(record) {
    const abstractBlock = record.abstract ? `<div class="pcg-abstract">${record.abstract}</div>` : '';
    const sections = splitDescriptionSections(record.description);
    if (sections.length <= 1) return abstractBlock + (sections[0] ? sections[0].html : '');

    const subtabBar = sections.map((s, i) => `<button type="button" class="pcg-subtab${i === 0 ? ' pcg-subtab-active' : ''}" data-subtab="${i}">${escHtml(s.title || 'Untitled')}</button>`).join('');
    const subpanels = sections.map((s, i) => `<div class="pcg-subtab-panel${i === 0 ? '' : ' pcg-hidden'}" data-subpanel="${i}">${s.html}</div>`).join('');
    return abstractBlock + `<div class="pcg-subtab-bar">${subtabBar}</div><div class="pcg-subtab-panels">${subpanels}</div>`;
  }
  function renderTabPanel(key, record) {
    switch (key) {
      case 'info': return renderInfoPanel(record);
      case 'description': return renderDescriptionPanel(record);
      case 'claims': return record.claims;
      case 'images': return renderImagesPanel(record);
      case 'classifications': return renderClassificationsPanel(record);
      case 'definitions': return renderDefinitionsPanel(record);
      case 'landscapes': return renderLandscapesPanel(record);
      default: return '';
    }
  }

  // Renders every non-empty section as its own tab so what's actually
  // available (and how much of it) is visible at a glance -- "Images 4",
  // "Claims 17", etc. -- rather than one long scroll you have to read
  // through to find out whether a section even exists for this patent.
  function renderExpand(container, record) {
    const tabs = TAB_ORDER.filter(k => tabHasContent(record, k));
    if (!tabs.length) {
      // Every real patent record has at minimum an application number and
      // dates in Info -- zero tabs on a successful fetch means the itemprop
      // selectors this whole parser depends on didn't match anything,
      // which is almost certainly Google having changed its schema, not a
      // genuinely empty patent. Silent before; now it's a violate().
      violate('parseRecord produced nothing', 'a successful /xhr/result fetch produced zero populated tabs -- the itemprop selectors parseRecord() depends on may no longer match Google\'s current schema');
      container.innerHTML = '<div class="pcg-expand-status">No parsed content available for this document.</div>';
      return;
    }

    const tabBar = tabs.map((k, i) => {
      const n = tabCount(record, k);
      return `<button type="button" class="pcg-tab${i === 0 ? ' pcg-tab-active' : ''}" data-tab="${k}">${TAB_LABELS[k]}${n != null ? ` <span class="pcg-tab-count">${n}</span>` : ''}</button>`;
    }).join('');
    const panels = tabs.map((k, i) => `<div class="pcg-tab-panel${i === 0 ? '' : ' pcg-hidden'}" data-panel="${k}">${renderTabPanel(k, record)}</div>`).join('');
    container.innerHTML = `<div class="pcg-tab-bar">${tabBar}</div><div class="pcg-tab-panels">${panels}</div>`;

    // One delegated listener handles both the top-level tabs and any
    // Description subtabs -- subtabs only exist inside whichever
    // .pcg-tab-panel they were rendered into, so their active/hidden
    // toggling is scoped to that one panel, not the whole container.
    container.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.pcg-tab');
      if (tabBtn) {
        const key = tabBtn.dataset.tab;
        container.querySelectorAll('.pcg-tab').forEach(b => b.classList.toggle('pcg-tab-active', b === tabBtn));
        container.querySelectorAll('.pcg-tab-panel').forEach(p => p.classList.toggle('pcg-hidden', p.dataset.panel !== key));
        return;
      }
      const subtabBtn = e.target.closest('.pcg-subtab');
      if (subtabBtn) {
        const idx = subtabBtn.dataset.subtab;
        const scope = subtabBtn.closest('.pcg-tab-panel') || container;
        scope.querySelectorAll('.pcg-subtab').forEach(b => b.classList.toggle('pcg-subtab-active', b === subtabBtn));
        scope.querySelectorAll('.pcg-subtab-panel').forEach(p => p.classList.toggle('pcg-hidden', p.dataset.subpanel !== idx));
      }
    });
  }

  function fetchResult(patentId) {
    if (resultCache.has(patentId)) return Promise.resolve(resultCache.get(patentId));
    const qs = encodeURIComponent(location.search.replace(/^\?/, ''));
    const url = `https://patents.google.com/xhr/result?id=${encodeURIComponent(patentId)}&qs=${qs}&exp=`;
    return fetch(url, { credentials: 'include' }).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    }).then(text => { resultCache.set(patentId, text); return text; });
  }

  function patentIdFromCard(item) {
    const el = item.querySelector('.result-title.search-result-item[data-result]');
    return el ? el.dataset.result : null;
  }

  function toggleExpand(item) {
    const patentId = patentIdFromCard(item);
    if (!patentId) { violate('inline expand', 'clicked a card with no data-result attribute on its .result-title -- cannot look up its patent id'); return; }

    let box = item.querySelector('.pcg-expand');
    // Pagination reuses the same search-result-item DOM node for a new
    // patent (confirmed: Google's dom-repeat rebinds data in place rather
    // than destroying/recreating stamped elements) -- our own injected
    // .pcg-expand box isn't part of that template, so it survives the
    // rebind untouched and would otherwise show the PREVIOUS card's
    // content under the new card's title/thumbnail. If the id this box
    // was built for doesn't match the card's current id, it's stale:
    // discard and rebuild rather than just toggling visibility.
    if (box && box.dataset.patentId !== patentId) { box.remove(); box = null; }
    if (box) { box.hidden = !box.hidden; return; }

    box = document.createElement('div');
    box.className = 'pcg-expand';
    box.dataset.patentId = patentId;
    box.innerHTML = '<div class="pcg-expand-status">Loading full text…</div>';
    item.querySelector('article.result').appendChild(box);

    fetchResult(patentId).then(html => {
      renderExpand(box, parseRecord(html));
    }).catch(e => {
      const patentUrl = `https://patents.google.com/${patentId}`;
      box.innerHTML = `<div class="pcg-expand-error">Couldn't load full text (${(e && e.message) || e}) — <a href="${patentUrl}" target="_blank" rel="noopener">open the full patent →</a></div>`;
      warn('inline expand fetch failed for', patentId, e);
    });
  }

  // Catches the case where a card is left EXPANDED (visible, not just
  // present-but-hidden) across a pagination change -- without this, the
  // stale content in the toggleExpand check above would only get cleared
  // the next time that specific card is clicked, but it'd be visibly wrong
  // on screen in the meantime. Runs from the same MutationObserver that
  // already watches for SPA re-renders.
  function clearStaleExpands() {
    document.querySelectorAll('.pcg-expand').forEach(box => {
      const item = box.closest('search-result-item');
      const currentId = item && patentIdFromCard(item);
      if (currentId !== box.dataset.patentId) box.remove();
    });
  }

  function bindInlineExpand() {
    document.addEventListener('click', guard('inline-expand-click', (e) => {
      if (!state.grid) return;
      const item = e.target.closest('search-result-item');
      if (!item) return;
      // Same exclusions as LinkedIn Insight Mode's card-click-expand: don't
      // fight real links/buttons, and don't collapse an in-progress text
      // selection (e.g. the user copying a sentence out of the abstract).
      if (e.target.closest('a, button, [role="button"], input, textarea')) return;
      if (window.getSelection().toString().length > 0) return;
      toggleExpand(item);
    }));
  }

  // Single reusable overlay rather than one per thumbnail -- images panels
  // get rebuilt fresh on every card expand, so a per-cell listener would
  // mean rebinding constantly. Delegated on document instead: mouseenter/
  // mouseleave don't bubble, but mouseover/mouseout do, so those are what
  // this listens for. Hover-only preview; the underlying <a> still opens
  // the full image in a new tab on click, unchanged.
  function bindImageHoverPreview() {
    // Created lazily on first hover rather than at bind time -- this binds
    // at document-start (before document.body necessarily exists), but a
    // real mouseover can only happen once there's rendered content to hover
    // over, by which point body always exists.
    let preview = null;
    function ensurePreview() {
      if (preview) return preview;
      preview = document.createElement('div');
      preview.id = 'pcg-image-preview';
      preview.innerHTML = '<img>';
      document.body.appendChild(preview);
      return preview;
    }

    document.addEventListener('mouseover', guard('image-preview-show', (e) => {
      const cell = e.target.closest('.pcg-image-cell');
      if (!cell) return;
      const p = ensurePreview();
      p.querySelector('img').src = cell.getAttribute('href');
      p.style.display = 'flex';
    }));
    document.addEventListener('mouseout', guard('image-preview-hide', (e) => {
      if (!preview) return; // can't have shown yet, nothing to hide
      const cell = e.target.closest('.pcg-image-cell');
      if (!cell) return;
      // relatedTarget is where the pointer went TO -- if that's still
      // inside the same cell (e.g. moving from the <a> onto its <img>),
      // this is a false-alarm "leave" and the preview should stay open.
      if (cell.contains(e.relatedTarget)) return;
      preview.style.display = 'none';
    }));
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────
  // No per-node tagging pass is needed (unlike the LinkedIn script) because
  // Google's class names are stable enough to select directly in CSS. The
  // only JS job left is: attach the settings panel once the results app has
  // mounted, and re-check after SPA re-renders (pagination, filter changes,
  // or typing a brand new search -- this is a client-routed SPA, so a new
  // /xhr/query never reloads the page, it just replaces DOM in place) in
  // case the panel got wiped along with everything else.

  const safeCheck = guard('boot-check', () => {
    if (document.querySelector('search-results')) buildPanel();
  });

  // Sanity check, not a feature: if these selectors ever stop matching
  // (Google renaming a class/tag, the usual failure mode for everything in
  // this script), grid/reskin go silently inert with no visible sign
  // anything's wrong. This makes that loud instead.
  //
  // This used to be a single setTimeout fired once at boot -- which meant
  // if the very first page view was the bare homepage (no query yet), it
  // ran once, found nothing to check, and never ran again for the rest of
  // the session, including every real search performed afterward. A
  // selector breaking only on a SECOND-or-later search would've gone
  // undetected forever. Now it's debounced off the same MutationObserver
  // that already watches for SPA re-renders, so it re-fires after every
  // burst of DOM changes settles -- i.e. after every new search, not just
  // the first one. violate()'s own dedup (by name+details) keeps repeat
  // passes from spamming the banner for the same already-known problem.
  const runSanityCheck = guard('sanity-check', () => {
    const results = document.querySelector('search-results');
    if (!results) { log('no search-results component on this page — nothing to do here'); return; }
    if (!document.getElementById('pcg-panel')) err('panel never attached -- buildPanel() may be throwing, check above for stack traces');
    const hasItems = document.querySelector('search-result-item');
    const noResults = document.getElementById('noResultsMessage');
    if (!hasItems && !(noResults && !noResults.hidden)) {
      violate('no search-result-item found', 'search-results mounted but neither a result card nor a visible #noResultsMessage was found -- selector may have changed, or results are still loading slowly');
    }
    if (hasItems && !document.querySelector('h4.metadata.search-result-item')) violate('metadata selector', 'search-result-item found but h4.metadata.search-result-item did not -- badges/jurisdiction styling has nothing to attach to');
    if (contractViolations.size) warn(contractViolations.size, 'contract violation(s) so far');
    log('sanity check complete -- query:', location.search || '(none)');
  });
  let sanityTimer = null;
  function scheduleSanityCheck() {
    clearTimeout(sanityTimer);
    sanityTimer = setTimeout(runSanityCheck, 1800);
  }

  bindInlineExpand();
  bindImageHoverPreview();
  safeCheck();
  scheduleSanityCheck();
  new MutationObserver(guard('mutation-observer-callback', () => {
    safeCheck();
    scheduleSanityCheck();
    clearStaleExpands();
  })).observe(document.documentElement, {
    childList: true,
    subtree: true,
    // attributes/attributeFilter is a best-effort assumption -- IF Google
    // rebinds data-result via setAttribute (typical for Polymer's data
    // binding), this fires immediately. But that's a guess about a
    // mechanism we haven't independently verified, not a confirmed
    // contract -- unlike the DOM selectors above, which at least fail
    // loudly via violate() when wrong, a wrong guess here would just mean
    // this specific observer never fires, with nothing to say so. That's
    // exactly why clearStaleExpands() ALSO runs on a plain interval below,
    // same pattern as ArrowGraph's own "safety net for missed layout
    // shifts" -- correctness here doesn't depend on having guessed
    // Google's update mechanism right.
    attributes: true,
    attributeFilter: ['data-result'],
  });
  setInterval(guard('stale-expand-safety-net', clearStaleExpands), 2000);

  log('loaded, version', VERSION, 'config:', JSON.stringify(state));
})();
