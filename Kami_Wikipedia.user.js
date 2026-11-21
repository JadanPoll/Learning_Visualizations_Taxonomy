// ==UserScript==
// @name         Kami Reading Companion
// @namespace    http://tampermonkey.net/
// @version      5.0.0
// @description  Q&A + Passages + Wikipedia trail for active reading. Kami API + GM storage persistence.
// @match        *://web.kamihq.com/web/viewer.html*
// @match        *://en.wikipedia.org/wiki/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
  'use strict';

  // ─── Route by host ────────────────────────────────────────────────────────
  // Wikipedia companion runs as a lightweight sidecar.
  // All Kami code below is unreachable from Wikipedia context.

  if (location.hostname.includes('wikipedia.org')) {
    initWikipedia();
    return;
  }

  // ─── Constants ────────────────────────────────────────────────────────────

  const SENTINEL       = '[KRC_STATE_v2]';
  const AUTOSAVE_DELAY = 1500;
  const KAMI_VERSION   = '2.0.23700-20260618234058';

  // ─── Logging ──────────────────────────────────────────────────────────────
  // 🟣 purple  = KRC lifecycle/boot
  // 🟢 green   = success / data found
  // 🟡 yellow  = warning / fallback
  // 🔴 red     = hard failure

  const L = {
    info    : (...a) => console.log   ('%c[KRC]',    'color:#818cf8;font-weight:bold', ...a),
    success : (...a) => console.log   ('%c[KRC ✓]',  'color:#22c55e;font-weight:bold', ...a),
    warn    : (...a) => console.warn  ('%c[KRC ⚠]',  'color:#eab308;font-weight:bold', ...a),
    fail    : (...a) => console.error ('%c[KRC ✕]',  'color:#ef4444;font-weight:bold', ...a),
  };

  // ─── Credentials & Document Identity ─────────────────────────────────────

  let creds = {
    userId      : null,
    token       : null,
    domainId    : null,
    userName    : null,
    kamiVersion : null,
    clientId    : null,
  };

  let doc = {
    identifier : null,
    id         : null,
    name       : null,
  };

  // ─── Anchor Comment ───────────────────────────────────────────────────────

  let anchor = {
    uuid      : null,
    createdAt : null,
  };

  // ─── App State ────────────────────────────────────────────────────────────

  let state = {
    questions : [],   // [{ id, title, question, roughWork, notes, resolved, updatedAt }]
    insights  : [],   // [{ id, text, createdAt }]
    activeId  : null,
    savedAt   : null,
  };

  let kamiHighlights = [];  // [{ id, text, page, note, color, createdAt }] — from GET /comments
  let wikiTrail      = null; // null = not yet loaded from GM storage

  let saveTimer = null;
  let booted    = false;

  // ─── GM Storage Helpers ───────────────────────────────────────────────────
  // GM_getValue/GM_setValue are cross-origin within the same script.
  // Used to share state between Kami sessions and the Wikipedia companion.

  function gmGet(key, fallback = null) {
    try {
      const val = GM_getValue(key, null);
      if (val === null || val === undefined) return fallback;
      // Legacy: data was stored as JSON.stringify'd strings before object-direct storage
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch { return val; }
      }
      return val;
    } catch (e) {
      L.fail(`GM_getValue("${key}") failed:`, e.message);
      setSyncBanner('err', `✕ GM storage read failed for "${key}": ${e.message}`);
      return fallback;
    }
  }

  function gmSet(key, value) {
    try {
      GM_setValue(key, value);
    } catch (e) {
      L.fail(`GM_setValue("${key}") failed:`, e.message);
      setSyncBanner('err', `✕ GM storage write failed for "${key}": ${e.message}`);
      throw e;
    }
  }

  // ─── Viz Library ──────────────────────────────────────────────────────────

  const VIZ_LIBRARY_BASE = 'https://jadanpoll.github.io/Learning_Visualizations_Taxonomy/';
  const VIZ_INDEX_URL    = VIZ_LIBRARY_BASE + 'index.json';

  let vizLibrary = null; // null = not yet fetched, [] = fetched but empty/failed

  async function loadVizLibrary() {
    try {
      const resp = await fetch(VIZ_INDEX_URL);
      if (!resp.ok) throw new Error(`HTTP ${resp.status} — does index.json exist in the repo?`);
      const data = await resp.json();
      vizLibrary = Array.isArray(data) ? data : (data.visualizations ?? []);
      L.success(`Viz library loaded — ${vizLibrary.length} entries`);
    } catch (e) {
      vizLibrary = [];
      setSyncBanner('err', `✕ Viz library: ${e.message}`);
      L.fail('loadVizLibrary failed:', e.message);
    }
    if (activeTab() === 'viz') renderPane('viz');
  }

  // ─── Viz Storage Helpers ──────────────────────────────────────────────────

  const VIZ_PROMPT = `Generate a self-contained interactive HTML visualization for:

[paste passage or concept]

Requirements:
- Single file, all CSS and JS inline
- No external dependencies or CDN links
- Include interactive controls (sliders, buttons) where meaningful
- Dark background preferred
- Explain what the controls do in small labels`;

  function getVizzes() { return gmGet('krc_viz', []) ?? []; }

  // ─── Floating Viz Window ──────────────────────────────────────────────────

  let vizFloat = null;

  function ensureVizFloat() {
    if (vizFloat) return vizFloat;

    vizFloat = document.createElement('div');
    vizFloat.id = 'krc-viz-float';
    vizFloat.innerHTML = `
      <div id="krc-viz-float-header">
        <span id="krc-viz-float-title">Visualization</span>
        <div style="display:flex;gap:4px">
          <button class="krc-viz-float-btn" id="krc-viz-float-min" title="Minimize">—</button>
          <button class="krc-viz-float-btn" id="krc-viz-float-close" title="Close">✕</button>
        </div>
      </div>
      <iframe sandbox="allow-scripts" id="krc-viz-iframe"></iframe>
    `;
    document.body.appendChild(vizFloat);

    // Drag
    const header = vizFloat.querySelector('#krc-viz-float-header');
    let ox = 0, oy = 0;
    header.addEventListener('mousedown', e => {
      if (e.target.closest('button')) return;
      e.preventDefault();
      ox = e.clientX - vizFloat.offsetLeft;
      oy = e.clientY - vizFloat.offsetTop;
      const move = e2 => {
        vizFloat.style.left = Math.max(0, e2.clientX - ox) + 'px';
        vizFloat.style.top  = Math.max(0, e2.clientY - oy) + 'px';
      };
      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });

    // Minimize — collapse to header only
    let minimized = false;
    const iframe = vizFloat.querySelector('#krc-viz-iframe');
    vizFloat.querySelector('#krc-viz-float-min').addEventListener('click', () => {
      minimized = !minimized;
      iframe.style.display = minimized ? 'none' : '';
      vizFloat.style.resize = minimized ? 'none' : 'both';
    });

    vizFloat.querySelector('#krc-viz-float-close').addEventListener('click', () => {
      vizFloat.style.display = 'none';
      iframe.src = 'about:blank';
    });

    return vizFloat;
  }

  function openVizFloat(entry) {
    const win = ensureVizFloat();
    win.querySelector('#krc-viz-float-title').textContent = entry.concept;
    const iframe = win.querySelector('#krc-viz-iframe');
    iframe.style.display = '';
    iframe.src = entry.rawUrl;
    win.style.display = 'flex';
  }

  // ─── Bootstrap: localStorage ──────────────────────────────────────────────

  function harvestCredsFromStorage() {
    const raw = localStorage.getItem('notable.user');
    if (!raw) FAIL('notable.user not found in localStorage — are you logged in to Kami?');

    let user;
    try { user = JSON.parse(raw); }
    catch (e) { FAIL('notable.user in localStorage is not valid JSON', e); }

    creds.userId   = user.id                      ?? null;
    creds.token    = user.authentication_token    ?? null;
    creds.domainId = user.domain_id               ?? null;
    creds.userName = user.name                    ?? 'KRC User';

    if (!creds.userId)   FAIL('notable.user present but id is missing');
    if (!creds.token)    FAIL('notable.user present but authentication_token is missing');
    if (!creds.domainId) FAIL('notable.user present but domain_id is missing');

    L.success('Credentials loaded from localStorage —',
      `userId=${creds.userId} domainId=${creds.domainId} token=${creds.token.slice(0,6)}…`);
  }

  // ─── Bootstrap: URL Fallback ──────────────────────────────────────────────

  function parseUrlFallback() {
    // Best-effort only — never fatal. NOTABLEOPEN will always confirm/override.
    try {
      const params   = new URLSearchParams(window.location.search);
      const stateRaw = params.get('state');
      if (stateRaw) {
        const stateObj = JSON.parse(decodeURIComponent(stateRaw));
        doc.identifier = doc.identifier ?? stateObj?.ids?.[0] ?? null;
      }
      // Try other known Kami URL param shapes
      doc.identifier = doc.identifier
        ?? params.get('document_identifier')
        ?? params.get('file_id')
        ?? params.get('document_id')
        ?? null;
      const fname = params.get('filename');
      doc.name = doc.name ?? (fname && fname !== 'undefined' ? fname : null);

      if (doc.identifier) {
        L.warn('doc.identifier from URL fallback —', doc.identifier);
      } else {
        L.warn('doc.identifier not in URL — will wait for NOTABLEOPEN event');
      }
    } catch (e) {
      L.warn('URL fallback parse error (non-fatal) —', e.message);
    }
  }

  // ─── Bootstrap: Console Interception ─────────────────────────────────────

  function installConsoleInterceptor() {
    const origLog = console.log;

    console.log = function (...args) {
      origLog.apply(console, args);

      try {
        const msg = typeof args[0] === 'string' ? args[0] : '';

        if (msg.includes('NOTABLEOPEN') && args[1]) {
          const data = args[1];
          if (data.document_identifier) {
            const prev = doc.identifier;
            doc.identifier = data.document_identifier;
            doc.name       = (data.filename && data.filename !== 'undefined') ? data.filename : doc.name;
            if (prev && prev !== doc.identifier) {
              L.warn('NOTABLEOPEN: doc.identifier changed mid-session', prev, '→', doc.identifier);
            } else {
              L.success('NOTABLEOPEN: doc.identifier confirmed —', doc.identifier);
            }
            // Keep GM storage current so the Wikipedia companion can find this doc
            try {
              gmSet('krc_current_doc', { id: doc.identifier, name: doc.name || 'Unknown', timestamp: new Date().toISOString() });
              L.info('krc_current_doc updated in GM storage');
            } catch (e) {
              // Non-fatal — wiki linking will just use a stale name
              L.warn('Could not update krc_current_doc:', e.message);
            }
          }
        }

        if (msg.includes('Centrifuge connect') && args[1]?.client_id) {
          const prev = creds.clientId;
          creds.clientId = args[1].client_id;
          if (prev !== creds.clientId) {
            L.success('Centrifuge client_id captured —', creds.clientId,
              '(transport:', args[1].transport + ')');
          }
        }

      } catch (e) {
        origLog('%c[KRC] console interceptor error (non-fatal):', 'color:#ef4444', e);
      }
    };

    L.info('Console interceptor installed');
  }

  // ─── Bootstrap: Fetch Interception ───────────────────────────────────────

  function installFetchInterceptor() {
    const origFetch = window.fetch;

    window.fetch = async function (...args) {
      const resp = await origFetch.apply(this, args);

      try {
        const url    = typeof args[0] === 'string' ? args[0] : (args[0]?.url ?? '');
        const method = (args[1]?.method ?? 'GET').toUpperCase();

        if (!creds.kamiVersion && url.includes('kamihq.com')) {
          const kv = args[1]?.headers?.['kami-version'];
          if (kv) { creds.kamiVersion = kv; L.success('kami-version captured —', kv); }
        }

        if (!doc.id && method === 'PUT'
            && url.includes('/api/documents/')
            && !url.includes('/comments')) {
          resp.clone().json().then(data => {
            if (data.id && data.document_identifier === doc.identifier) {
              doc.id = data.id;
              L.success('Kami internal document UUID harvested —', doc.id);
            }
          }).catch(e => L.warn('Could not parse /api/documents/ PUT for doc.id:', e.message));
        }
      } catch (e) {
        L.warn('Fetch interceptor error (non-fatal):', e.message);
      }

      return resp;
    };

    L.info('Fetch interceptor installed');
  }

  // ─── Kami API Helpers ─────────────────────────────────────────────────────

  function kamiHeaders() {
    if (!creds.token)    FAIL('kamiHeaders() called before token was available');
    if (!creds.domainId) FAIL('kamiHeaders() called before domainId was available');
    return {
      'accept'         : 'application/json, text/plain, */*',
      'content-type'   : 'application/json;charset=UTF-8',
      'kami-version'   : creds.kamiVersion ?? KAMI_VERSION,
      'user-id'        : String(creds.userId),
      'user-token'     : creds.token,
      'user-domain-id' : String(creds.domainId),
    };
  }

  function commentUrl(uuid) {
    const base = `https://web.kamihq.com/api/documents/${doc.identifier}/comments`;
    const q    = `exclude_response_comment=true&realtime_client_id=${creds.clientId}`;
    return uuid ? `${base}/${uuid}?${q}` : `${base}?${q}`;
  }

  async function kamiGet(url) {
    L.info('GET', url);
    const resp = await fetch(url, {
      method: 'GET', headers: kamiHeaders(), mode: 'cors', credentials: 'include',
    });
    if (!resp.ok) FAIL(`GET ${url} failed — HTTP ${resp.status}`);
    const data = await resp.json();
    L.success('GET OK', url);
    return data;
  }

  async function kamiPut(url, body) {
    L.info('PUT', url);
    const resp = await fetch(url, {
      method: 'PUT', headers: kamiHeaders(),
      body: JSON.stringify(body), mode: 'cors', credentials: 'include',
    });
    if (!resp.ok) FAIL(`PUT ${url} failed — HTTP ${resp.status}`);
    const data = await resp.json();
    if (data.success !== true) FAIL(`PUT ${url} returned success=false`, data);
    L.success('PUT OK', url);
    return data;
  }

  // ─── Comments Loading ─────────────────────────────────────────────────────
  // Single GET /comments call. Extracts:
  //   - anchor comment (state store)
  //   - highlight annotations (Passages tab)

  function extractPlainNote(content) {
    if (!content) return '';
    try {
      const delta = JSON.parse(content);
      return (delta?.ops ?? []).map(op => op.insert ?? '').join('').trim();
    } catch {
      return typeof content === 'string' ? content.trim() : '';
    }
  }

  async function loadCommentsData() {
    L.info('Loading comments from API…');
    const data = await kamiGet(commentUrl());
    const all  = data.comments ?? [];

    // Anchor comment (state store)
    const anchorComment = all.find(c => !c.deleted_at && isAnchorContent(c.content)) ?? null;

    // Highlights for Passages tab
    kamiHighlights = all
      .filter(c => !c.deleted_at
               && c.annotation_type === 'Highlight'
               && c.referring_to?.selected_text)
      .map(c => ({
        id        : c.id,
        text      : c.referring_to.selected_text,
        page      : c.referring_to.page_no ?? null,
        note      : extractPlainNote(c.content),
        color     : c.referring_to.color ?? null,
        createdAt : c.created_at,
      }))
      .sort((a, b) => (a.page ?? 0) - (b.page ?? 0));

    L.success(`Comments loaded — anchor: ${anchorComment ? 'found' : 'none'}, highlights: ${kamiHighlights.length}, total: ${all.length}`);
    return anchorComment;
  }

  function isAnchorContent(content) {
    try {
      const delta = JSON.parse(content);
      return delta?.ops?.[0]?.insert?.startsWith(SENTINEL) ?? false;
    } catch { return false; }
  }

  function extractStateFromContent(content) {
    try {
      const delta = JSON.parse(content);
      const raw   = delta?.ops?.[0]?.insert?.trim() ?? '';
      return deserialize(raw);
    } catch (e) {
      FAIL('Failed to extract state from anchor comment — data corrupt?', e);
    }
  }

  function buildAnchorBody(serializedState) {
    const content = JSON.stringify({
      ops: [{ insert: serializedState + '\n' }], props: {},
    });
    return {
      id                  : anchor.uuid,
      author              : { id: creds.userId, name: creds.userName },
      author_id           : creds.userId,
      document_identifier : doc.identifier,
      document_id         : doc.id ?? doc.identifier,
      created_at          : anchor.createdAt ?? new Date().toISOString(),
      content,
      annotation_type     : 'RichText',
      tool_params         : { type: 'richtext', subtype: null },
      referring_to        : {
        user_action: 'click', page_no: 1,
        x: 8, y: 8, color: null, font_size: '11px',
        width: 72, height: 20, rotation: 0, nowrap: true,
        cache_html: '<span style="font-size:11px;font-weight:700;font-family:monospace;color:#6366f1">◆ KRC</span>',
        cache_version: 1,
      },
      parent_comment_id : null,
      replies           : [],
      y_offset          : 0,
      deleted_at        : null,
      updated_at        : Date.now(),
    };
  }

  // ─── State Load / Save ────────────────────────────────────────────────────

  async function loadState() {
    setSyncBanner('warn', 'Loading saved state…');

    let apiState   = null;
    let localState = null;

    try {
      const comment = await loadCommentsData();
      if (comment) {
        apiState = extractStateFromContent(comment.content);
        if (!apiState) FAIL('Anchor comment found but deserialization returned null — data may be corrupt');
        L.success('State loaded from Kami API —',
          `${apiState.questions?.length ?? 0} questions, ${apiState.insights?.length ?? 0} insights`);
      }
    } catch (e) {
      setSyncBanner('err', `✕ API load failed: ${e.message}`);
      L.fail('API state load failed:', e.message);
      throw e;
    }

    try {
      const raw = localStorage.getItem(localKey());
      if (raw) {
        localState = deserialize(raw);
        L.success('State loaded from localStorage —',
          `${localState?.questions?.length ?? 0} questions, ${localState?.insights?.length ?? 0} insights`);
      } else {
        L.info('No state in localStorage for this document');
      }
    } catch (e) {
      FAIL('localStorage read failed', e);
    }

    if (apiState && localState) {
      const differ = JSON.stringify(apiState) !== JSON.stringify(localState);
      if (differ) {
        L.warn('API and localStorage states differ — showing conflict overlay');
        showConflictOverlay(apiState, localState);
        return;
      }
      L.info('API and localStorage states match — no conflict');
    }

    const resolved = apiState ?? localState;
    if (resolved) {
      applyState(resolved);
      setSyncBanner('ok', apiState ? '✓ Loaded from Kami API' : '⚠ Loaded from local storage only');
    } else {
      L.info('No saved state found — fresh session');
      setSyncBanner('warn', 'No saved data — start reading and your state will auto-save');
      renderPane(activeTab());
    }
  }

  async function persistState() {
    state.savedAt = new Date().toISOString();
    const serialized = serialize();

    try {
      localStorage.setItem(localKey(), serialized);
      L.info('State written to localStorage');
    } catch (e) {
      FAIL('localStorage write failed', e);
    }

    if (!anchor.uuid) {
      anchor.uuid      = crypto.randomUUID();
      anchor.createdAt = new Date().toISOString();
      L.info('New anchor UUID minted —', anchor.uuid);
    }

    setSaveStatus('saving…');

    try {
      await kamiPut(commentUrl(anchor.uuid), buildAnchorBody(serialized));
      setSaveStatus('saved ✓');
      setSyncBanner('ok', '✓ Synced to Kami (Google Drive)');
      L.success('State synced to Kami anchor comment');
    } catch (e) {
      setSaveStatus('sync failed ✕');
      setSyncBanner('err', `✕ Kami sync failed: ${e.message} — data is local only`);
      L.fail('Kami sync failed:', e.message);
      throw e;
    }
  }

  function scheduleSave() {
    setSaveStatus('unsaved…');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      persistState().catch(e => L.fail('persistState threw:', e));
    }, AUTOSAVE_DELAY);
  }

  // ─── Serialisation ────────────────────────────────────────────────────────

  function serialize(s) {
    return SENTINEL + btoa(unescape(encodeURIComponent(JSON.stringify(s ?? state))));
  }

  function deserialize(raw) {
    if (!raw?.startsWith(SENTINEL)) return null;
    try {
      return JSON.parse(decodeURIComponent(escape(atob(raw.slice(SENTINEL.length)))));
    } catch (e) {
      FAIL('deserialize failed — data corrupt?', e);
    }
  }

  function applyState(s) {
    state = s;
    if (!state.questions)               state.questions = state.problems ?? [];
    if (!Array.isArray(state.insights)) state.insights  = [];
    renderPane(activeTab());
  }

  function localKey() {
    return `krc_state_${doc.identifier ?? 'unknown'}`;
  }

  // ─── Error Handling ───────────────────────────────────────────────────────
  // Hard failures: loud console.error + full-panel red overlay + thrown Error.
  // Nothing fails silently.

  function FAIL(msg, cause) {
    const full = `[KRC] ${msg}${cause ? ' — ' + cause : ''}`;
    L.fail(msg, cause ?? '');
    // Red overlay on the panel — unmissable
    const panel = document.getElementById('krc-panel');
    if (panel) {
      let overlay = document.getElementById('krc-fail-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'krc-fail-overlay';
        overlay.style.cssText = [
          'position:absolute', 'inset:0', 'background:rgba(63,0,0,0.97)',
          'z-index:100', 'display:flex', 'flex-direction:column',
          'align-items:center', 'justify-content:center',
          'padding:20px', 'gap:12px', 'text-align:center',
        ].join(';');
        panel.appendChild(overlay);
      }
      overlay.innerHTML = `
        <div style="font-size:28px">✕</div>
        <div style="color:#ef4444;font-size:13px;font-weight:700;letter-spacing:.05em;text-transform:uppercase">KRC Error</div>
        <div style="color:#fca5a5;font-size:11px;line-height:1.7;word-break:break-word">${escHtml(msg)}${cause ? '<br><br><span style="color:#9ca3af">' + escHtml(String(cause)) + '</span>' : ''}</div>
        <button onclick="document.getElementById('krc-fail-overlay').remove()"
          style="margin-top:8px;padding:6px 14px;background:#6366f1;color:#fff;border:none;border-radius:6px;font-size:11px;cursor:pointer">
          Dismiss
        </button>
      `;
    }
    setSyncBanner('err', `✕ ${msg}`);
    throw new Error(full);
  }

  // ─── Styles ───────────────────────────────────────────────────────────────

  GM_addStyle(`
    #krc-panel {
      position: fixed; right: 0; top: 0;
      width: 340px; height: 100vh;
      background: #1a1d27; border-left: 1px solid #2e3245;
      z-index: 999998; display: flex; flex-direction: column;
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 13px; color: #e2e4ed;
      transition: transform 0.25s ease;
    }
    #krc-panel.krc-hidden { transform: translateX(100%); }

    #krc-toggle {
      position: fixed; top: 50%; transform: translateY(-50%);
      z-index: 999999; background: #6366f1; color: white;
      border: none; border-radius: 6px 0 0 6px;
      padding: 10px 5px; cursor: pointer;
      writing-mode: vertical-rl; font-size: 11px; font-weight: 600;
      letter-spacing: .08em; user-select: none;
      transition: right 0.25s ease;
    }
    #krc-panel.krc-hidden  ~ #krc-toggle { right: 0; }
    #krc-panel:not(.krc-hidden) ~ #krc-toggle { right: 340px; }

    #krc-header {
      background: #12141e; padding: 10px 14px;
      border-bottom: 1px solid #2e3245;
      display: flex; align-items: center;
      justify-content: space-between; flex-shrink: 0;
    }
    #krc-header h2 {
      margin: 0; font-size: 13px; font-weight: 600;
      color: #6366f1; letter-spacing: .06em; text-transform: uppercase;
    }
    #krc-save-status { font-size: 10px; color: #6b7280; }

    #krc-tabs { display: flex; border-bottom: 1px solid #2e3245; flex-shrink: 0; }
    .krc-tab {
      flex: 1; padding: 8px 2px; background: none; border: none;
      border-bottom: 2px solid transparent; color: #6b7280;
      font-size: 10px; font-weight: 600;
      letter-spacing: .04em; text-transform: uppercase; cursor: pointer;
    }
    .krc-tab.active { color: #6366f1; border-bottom-color: #6366f1; }

    #krc-body {
      flex: 1; overflow-y: auto; padding: 12px;
      display: flex; flex-direction: column; gap: 10px;
    }

    #krc-sync-banner {
      font-size: 10px; text-align: center; padding: 3px 0; flex-shrink: 0;
    }
    #krc-sync-banner.ok   { background: #052e16; color: #22c55e; }
    #krc-sync-banner.warn { background: #3f2200; color: #eab308; }
    #krc-sync-banner.err  { background: #3f0000; color: #ef4444; font-weight: 700; }

    #krc-conflict {
      position: absolute; inset: 0; background: rgba(18,20,30,0.97);
      z-index: 10; display: flex; flex-direction: column;
      align-items: center; justify-content: flex-start;
      padding: 24px; gap: 14px; text-align: left;
    }
    #krc-conflict h3 { margin: 0; font-size: 14px; letter-spacing: .05em; text-transform: uppercase; color: #eab308; }
    #krc-conflict p  { margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.7; }
    .krc-conflict-option {
      background: #12141e; border: 1px solid #2e3245; border-radius: 6px;
      padding: 10px; font-size: 11px; color: #e2e4ed; line-height: 1.6;
      width: 100%; box-sizing: border-box;
    }
    .krc-conflict-option strong { color: #6366f1; }

    .krc-section-label {
      font-size: 10px; font-weight: 700; letter-spacing: .08em;
      text-transform: uppercase; color: #6b7280; margin-bottom: 4px;
    }
    #krc-question-display {
      background: #12141e; border: 1px solid #2e3245; border-radius: 6px;
      padding: 10px; min-height: 60px; font-size: 12px; line-height: 1.6;
      color: #e2e4ed; white-space: pre-wrap;
    }
    #krc-question-display.empty { color: #6b7280; font-style: italic; }

    textarea.krc-area {
      width: 100%; background: #12141e; border: 1px solid #2e3245;
      border-radius: 6px; color: #e2e4ed; font-family: inherit;
      font-size: 12px; line-height: 1.6; padding: 8px;
      resize: vertical; box-sizing: border-box;
    }
    textarea.krc-area:focus { outline: none; border-color: #6366f1; }
    textarea.krc-area::placeholder { color: #4b5268; }
    #krc-rough      { min-height: 100px; }
    #krc-notes-area { min-height: 80px;  }

    input.krc-input {
      width: 100%; background: #12141e; border: 1px solid #2e3245;
      border-radius: 6px; color: #e2e4ed; font-family: inherit;
      font-size: 12px; padding: 7px 8px; box-sizing: border-box; margin-bottom: 6px;
    }
    input.krc-input:focus { outline: none; border-color: #6366f1; }

    .krc-btn {
      padding: 7px 12px; border: none; border-radius: 6px;
      font-size: 12px; font-weight: 600; cursor: pointer; transition: opacity .15s;
    }
    .krc-btn:hover { opacity: .85; }
    .krc-btn.primary { background: #6366f1; color: #fff; }
    .krc-btn.ghost   { background: #2e3245; color: #e2e4ed; }
    .krc-btn.full    { width: 100%; }
    .krc-btn-row { display: flex; gap: 6px; flex-wrap: wrap; }

    #krc-btn-resolve {
      width: 100%; padding: 8px; border: none; border-radius: 6px;
      font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s;
    }
    #krc-btn-resolve.unresolved { background: #2e3245; color: #9ca3af; }
    #krc-btn-resolve.resolved   { background: #22c55e; color: #000; }

    #krc-question-list { display: flex; flex-direction: column; gap: 6px; }
    .krc-question-item {
      background: #12141e; border: 1px solid #2e3245; border-radius: 6px;
      padding: 8px 10px; cursor: pointer; display: flex; align-items: center; gap: 8px;
    }
    .krc-question-item:hover  { border-color: #6366f1; }
    .krc-question-item.active { border-color: #6366f1; background: #1e2035; }
    .krc-question-title {
      flex: 1; font-size: 12px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
    }
    .krc-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .krc-status-dot.resolved   { background: #22c55e; }
    .krc-status-dot.unresolved { background: #6b7280; }

    .krc-insight-card { display: flex; gap: 6px; align-items: flex-start; }
    .krc-insight-card textarea { flex: 1; min-height: 70px; }
    .krc-insight-del {
      background: none; border: 1px solid #2e3245; border-radius: 6px;
      color: #6b7280; font-size: 14px; padding: 4px 8px;
      cursor: pointer; flex-shrink: 0; line-height: 1; margin-top: 1px;
    }
    .krc-insight-del:hover { border-color: #ef4444; color: #ef4444; }
    .krc-divider { border: none; border-top: 1px solid #2e3245; margin: 4px 0; }

    /* ── Passages tab ─────────────────────────────────────────────── */
    .krc-passage-item {
      background: #12141e; border: 1px solid #2e3245; border-radius: 6px;
      padding: 8px 10px; display: flex; flex-direction: column; gap: 4px;
    }
    .krc-passage-meta {
      font-size: 10px; font-weight: 700; letter-spacing: .06em;
      text-transform: uppercase; color: #6b7280;
    }
    .krc-passage-text {
      font-size: 12px; line-height: 1.6; color: #e2e4ed;
      word-break: break-word;
    }
    .krc-passage-note {
      font-size: 11px; color: #9ca3af; font-style: italic;
      border-left: 2px solid #2e3245; padding-left: 6px; margin-top: 2px;
    }
    .krc-passage-color-dot {
      display: inline-block; width: 8px; height: 8px;
      border-radius: 50%; margin-right: 4px; vertical-align: middle; flex-shrink: 0;
    }

    /* ── Wiki tab ─────────────────────────────────────────────────── */
    .krc-wiki-entry {
      background: #12141e; border: 1px solid #2e3245; border-radius: 6px;
      padding: 10px; display: flex; flex-direction: column; gap: 6px;
    }
    .krc-wiki-title {
      display: flex; align-items: baseline; justify-content: space-between; gap: 6px;
    }
    .krc-wiki-title a {
      font-size: 12px; font-weight: 600; color: #6366f1;
      text-decoration: none; flex: 1; overflow: hidden;
      white-space: nowrap; text-overflow: ellipsis;
    }
    .krc-wiki-title a:hover { text-decoration: underline; }
    .krc-wiki-time { font-size: 10px; color: #6b7280; flex-shrink: 0; }
    .krc-wiki-highlights { display: flex; flex-direction: column; gap: 4px; margin-top: 2px; }
    .krc-wiki-hl {
      display: flex; align-items: flex-start; gap: 6px;
      font-size: 11px; color: #d1d5db; line-height: 1.5;
    }
    .krc-wiki-hl-text { flex: 1; word-break: break-word; }
    .krc-wiki-hl-note { font-size: 10px; color: #9ca3af; font-style: italic; margin-top: 2px; }
    #krc-wiki-refresh {
      background: none; border: 1px solid #2e3245; border-radius: 6px;
      color: #6b7280; font-size: 10px; padding: 3px 8px; cursor: pointer;
    }
    #krc-wiki-refresh:hover { border-color: #6366f1; color: #6366f1; }
    .krc-wiki-unlink {
      background: none; border: 1px solid #2e3245; border-radius: 4px;
      color: #6b7280; font-size: 10px; padding: 1px 5px; cursor: pointer; line-height: 1.4;
    }
    .krc-wiki-unlink:hover { border-color: #ef4444; color: #ef4444; }

    /* ── Viz tab ──────────────────────────────────────────────────────── */
    .krc-viz-card {
      background: #12141e; border: 1px solid #2e3245; border-radius: 6px;
      padding: 8px 10px; display: flex; align-items: center; gap: 8px;
      cursor: pointer; transition: border-color .15s;
    }
    .krc-viz-card:hover { border-color: #6366f1; }
    .krc-viz-label {
      flex: 1; font-size: 12px; overflow: hidden;
      white-space: nowrap; text-overflow: ellipsis; color: #e2e4ed;
    }
    .krc-viz-source {
      font-size: 10px; color: #6b7280; white-space: nowrap;
    }
    .krc-viz-del {
      background: none; border: 1px solid #2e3245; border-radius: 4px;
      color: #6b7280; font-size: 11px; padding: 1px 5px; cursor: pointer; line-height: 1.4;
    }
    .krc-viz-del:hover { border-color: #ef4444; color: #ef4444; }
    #krc-viz-prompt {
      background: #0e1018; border: 1px solid #2e3245; border-radius: 6px;
      padding: 8px; font: 10px/1.6 monospace; color: #6b7280;
      white-space: pre-wrap; word-break: break-word;
    }

    /* ── Floating viz window ──────────────────────────────────────────── */
    #krc-viz-float {
      position: fixed; top: 60px; left: 12px;
      width: 500px; height: 380px; min-width: 300px; min-height: 200px;
      background: #1a1d27; border: 1px solid #2e3245; border-radius: 10px;
      z-index: 999996; display: none; flex-direction: column;
      box-shadow: 0 8px 32px rgba(0,0,0,.65); resize: both; overflow: hidden;
    }
    #krc-viz-float-header {
      background: #12141e; padding: 8px 12px;
      display: flex; align-items: center; justify-content: space-between;
      cursor: move; flex-shrink: 0; border-bottom: 1px solid #2e3245;
      user-select: none;
    }
    #krc-viz-float-title {
      font-size: 12px; font-weight: 600; color: #e2e4ed;
      overflow: hidden; white-space: nowrap; text-overflow: ellipsis; flex: 1;
    }
    .krc-viz-float-btn {
      background: none; border: none; color: #6b7280; font-size: 14px;
      cursor: pointer; padding: 0 4px; line-height: 1; flex-shrink: 0;
    }
    .krc-viz-float-btn:hover { color: #e2e4ed; }
    #krc-viz-float iframe {
      flex: 1; width: 100%; border: none; background: #0e1018;
    }

    /* ── Q&A textarea card mode ───────────────────────────────────────── */
    /* When not focused, textareas read as content cards rather than inputs */
    textarea.krc-area:not(:focus) {
      resize: none;
      cursor: text;
      border-color: #202333;
    }
    textarea.krc-area:not(:focus):hover {
      border-color: #3a4060;
    }
    textarea.krc-area:focus {
      resize: vertical;
    }
  `);

  // ─── Panel HTML ───────────────────────────────────────────────────────────

  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'krc-panel';
    panel.innerHTML = `
      <div id="krc-header">
        <h2>Reading Companion</h2>
        <span id="krc-save-status">—</span>
      </div>
      <div id="krc-tabs">
        <button class="krc-tab active" data-tab="qa">Q&amp;A</button>
        <button class="krc-tab" data-tab="insights">Insights</button>
        <button class="krc-tab" data-tab="passages">Passages</button>
        <button class="krc-tab" data-tab="wiki">Wiki</button>
        <button class="krc-tab" data-tab="viz">Viz</button>
        <button class="krc-tab" data-tab="list">History</button>
      </div>
      <div id="krc-body"></div>
      <div id="krc-sync-banner" class="warn">Loading…</div>
    `;
    document.body.appendChild(panel);

    const toggle = document.createElement('button');
    toggle.id          = 'krc-toggle';
    toggle.textContent = 'STUDY';
    toggle.title       = 'Toggle Reading Companion';
    document.body.appendChild(toggle);

    toggle.addEventListener('click', () => panel.classList.toggle('krc-hidden'));
    panel.querySelectorAll('.krc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        panel.querySelectorAll('.krc-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderPane(tab.dataset.tab);
      });
    });

    renderPane('qa');
  }

  // ─── Conflict Overlay ─────────────────────────────────────────────────────

  function showConflictOverlay(apiState, localState) {
    byId('krc-conflict')?.remove();
    const el  = document.createElement('div');
    el.id     = 'krc-conflict';
    const fmt = ts => ts ? new Date(ts).toLocaleString() : 'unknown';
    const qc  = s  => s.questions?.length ?? 0;
    const ic  = s  => s.insights?.length  ?? 0;

    el.innerHTML = `
      <h3>⚠ Conflict Detected</h3>
      <p>Kami API and local storage differ. Choose which to keep.</p>
      <div class="krc-conflict-option">
        <strong>Kami API (cloud)</strong><br>
        Saved: ${fmt(apiState.savedAt)}<br>
        Questions: ${qc(apiState)} · Insights: ${ic(apiState)}
      </div>
      <div class="krc-conflict-option">
        <strong>Local storage</strong><br>
        Saved: ${fmt(localState.savedAt)}<br>
        Questions: ${qc(localState)} · Insights: ${ic(localState)}
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;width:100%">
        <button class="krc-btn primary full" id="krc-conflict-api">Use Kami (cloud) version</button>
        <button class="krc-btn ghost   full" id="krc-conflict-local">Use local version</button>
      </div>
    `;
    byId('krc-panel').appendChild(el);

    byId('krc-conflict-api').addEventListener('click', () => {
      applyState(apiState); el.remove();
      persistState().catch(e => L.fail('persistState after conflict resolve threw:', e));
    });
    byId('krc-conflict-local').addEventListener('click', () => {
      applyState(localState); el.remove();
      persistState().catch(e => L.fail('persistState after conflict resolve threw:', e));
    });
  }

  // ─── Pane Renderers ───────────────────────────────────────────────────────

  function renderPane(which) {
    const body = byId('krc-body');
    if (which === 'wiki' && wikiTrail === null) loadWikiTrail();
    if (which === 'viz'  && vizLibrary === null) loadVizLibrary();
    if      (which === 'qa')       body.innerHTML = buildQAPane();
    else if (which === 'passages') body.innerHTML = buildPassagesPane();
    else if (which === 'wiki')     body.innerHTML = buildWikiPane();
    else if (which === 'insights') body.innerHTML = buildInsightsPane();
    else if (which === 'viz')      body.innerHTML = buildVizPane();
    else if (which === 'list')     body.innerHTML = buildListPane();
    bindPaneEvents(which);
  }

  function currentQuestion() {
    return state.questions.find(q => q.id === state.activeId) || null;
  }

  // ─── Q&A Pane ─────────────────────────────────────────────────────────────
  // All three fields (question text, rough work, notes) are linked per question
  // and editable at any time — edits auto-save. Delete removes the question entirely.

  function buildQAPane() {
    const q        = currentQuestion();
    const question = q ? escHtml(q.question) : '';
    const rough    = q ? escHtml(q.roughWork) : '';
    const notes    = q ? escHtml(q.notes)     : '';
    const resolved = q?.resolved ?? false;
    const title    = q ? escHtml(q.title)     : '';

    const activeSection = q ? `
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <div class="krc-section-label" style="margin-bottom:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px" title="${title}">${title}</div>
          <button id="krc-btn-delete-q" style="background:none;border:1px solid #3f2020;border-radius:5px;color:#ef4444;font-size:10px;font-weight:600;padding:2px 8px;cursor:pointer;flex-shrink:0">Delete</button>
        </div>
        <textarea class="krc-area" id="krc-q-text" style="min-height:64px" placeholder="Question text…">${question}</textarea>
      </div>
      <div>
        <div class="krc-section-label">Rough Work</div>
        <textarea class="krc-area" id="krc-rough" placeholder="Work through it here…">${rough}</textarea>
      </div>
      <div>
        <div class="krc-section-label">Notes / LLM Insight</div>
        <textarea class="krc-area" id="krc-notes-area"
          placeholder="Paste LLM responses or your own notes — this accumulates over time as your understanding deepens…">${notes}</textarea>
      </div>
      <button id="krc-btn-resolve" class="${resolved ? 'resolved' : 'unresolved'}">
        ${resolved ? '✓ Resolved' : 'Mark as Resolved'}
      </button>
      <hr class="krc-divider">
    ` : '';

    return `
      ${activeSection}
      <div>
        <div class="krc-section-label">Add Question</div>
        <input class="krc-input" id="krc-new-title" placeholder="Short title">
        <textarea class="krc-area" id="krc-import-q" rows="4"
          placeholder="Write or paste the question…"></textarea>
        <div class="krc-btn-row" style="margin-top:6px">
          <button class="krc-btn primary" id="krc-btn-import">Add</button>
        </div>
      </div>
      ${!q ? '<div style="color:#6b7280;font-size:11px;font-style:italic;margin-top:4px">No question loaded — add one above or pick from History.</div>' : ''}
    `;
  }

  // ─── Passages Pane ────────────────────────────────────────────────────────

  function buildPassagesPane() {
    const highlightItems = kamiHighlights.length
      ? kamiHighlights.map((h, i) => {
          const dot = h.color
            ? `<span class="krc-passage-color-dot" style="background:${escHtml(h.color)}"></span>`
            : '';
          return `
            <div class="krc-passage-item" data-passage-idx="${i}" style="cursor:pointer" title="Click to jump to page ${h.page ?? '?'}">
              <div class="krc-passage-meta">${dot}Page ${h.page ?? '?'}</div>
              <div class="krc-passage-text">${escHtml(h.text)}</div>
              ${h.note ? `<div class="krc-passage-note">${escHtml(h.note)}</div>` : ''}
              <button class="krc-btn ghost krc-copy-passage" style="padding:3px 10px;font-size:11px;margin-top:2px" data-passage-idx="${i}">Copy</button>
            </div>
          `;
        }).join('')
      : '<div style="color:#6b7280;font-style:italic;font-size:12px">No highlights found in this document.<br>Highlight text in Kami and reload to see them here.</div>';

    return `
      <div>
        <div class="krc-section-label" style="margin-bottom:6px">Highlights from this paper</div>
        ${highlightItems}
      </div>
      <hr class="krc-divider">
      <div>
        <div class="krc-section-label" style="margin-bottom:4px">Page text</div>
        <div style="font-size:11px;color:#9ca3af;margin-bottom:8px;line-height:1.5">
          Copies the text of the page currently in your viewport. Paste into an LLM to generate questions or insights.
        </div>
        <button class="krc-btn ghost full" id="krc-btn-copy-page">Copy visible page text</button>
      </div>
    `;
  }

  // ─── Wiki Pane ────────────────────────────────────────────────────────────

  function buildWikiPane() {
    const docTrail = (wikiTrail || []).filter(e => e.kamiDocId === doc.identifier);

    const header = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px">
        <div class="krc-section-label" style="margin-bottom:0">Wikipedia trail</div>
        <button id="krc-wiki-refresh">↺ Refresh</button>
      </div>
      <div style="font-size:10px;color:#6b7280;margin-bottom:10px;line-height:1.5">
        Open a Wikipedia article and click "Link to Kami" to connect it to this paper.
      </div>
    `;

    if (!docTrail.length) {
      return header + '<div style="color:#6b7280;font-style:italic;font-size:12px">No pages linked to this document yet.</div>';
    }

    const entries = docTrail.map(entry => {
      const hls = entry.highlights ?? [];
      const hlHtml = hls.length
        ? hls.map(h => `
            <div class="krc-wiki-hl">
              ${h.color ? `<span style="display:inline-block;width:7px;height:7px;border-radius:2px;background:${escHtml(h.color)};flex-shrink:0;margin-top:3px"></span>` : ''}
              <div style="flex:1">
                <div class="krc-wiki-hl-text">${escHtml(h.text)}</div>
                ${h.note ? `<div class="krc-wiki-hl-note">${escHtml(h.note)}</div>` : ''}
              </div>
              <button class="krc-btn ghost" style="padding:2px 7px;font-size:10px;flex-shrink:0"
                data-copy-wiki="${encodeURIComponent(h.text)}">Copy</button>
            </div>
          `).join('')
        : '<div style="color:#6b7280;font-size:11px">No highlights captured from this page.</div>';

      return `
        <div class="krc-wiki-entry">
          <div class="krc-wiki-title">
            <a href="${escHtml(entry.url)}" target="_blank">${escHtml(entry.title)}</a>
            <div style="display:flex;align-items:center;gap:5px;flex-shrink:0">
              <span class="krc-wiki-time">${new Date(entry.linkedAt).toLocaleDateString()}</span>
              <button class="krc-wiki-unlink"
                data-unlink-url="${encodeURIComponent(entry.url)}"
                data-unlink-doc="${encodeURIComponent(entry.kamiDocId)}"
                title="Remove this page from the trail">✕</button>
            </div>
          </div>
          <div class="krc-wiki-highlights">${hlHtml}</div>
        </div>
      `;
    }).join('');

    return header + entries;
  }

  function loadWikiTrail() {
    try {
      wikiTrail = gmGet('krc_wiki_trail', []);
      L.success(`Wiki trail loaded — ${wikiTrail.length} total entries`);
    } catch (e) {
      wikiTrail = [];
      setSyncBanner('err', `✕ Failed to load Wikipedia trail: ${e.message}`);
      L.fail('loadWikiTrail failed:', e.message);
    }
  }

  // ─── Insights Pane ────────────────────────────────────────────────────────

  function buildInsightsPane() {
    const cards = state.insights.map(ins => `
      <div class="krc-insight-card" data-insight-id="${ins.id}">
        <textarea class="krc-area krc-insight-text" data-insight-id="${ins.id}"
          placeholder="Write an insight…">${escHtml(ins.text)}</textarea>
        <button class="krc-insight-del" data-del-insight="${ins.id}" title="Delete">✕</button>
      </div>
    `).join('');
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <div class="krc-section-label" style="margin-bottom:0">Insights</div>
        <button class="krc-btn primary" id="krc-btn-add-insight" style="padding:4px 10px;font-size:11px">+ Add</button>
      </div>
      ${cards || '<div style="color:#6b7280;font-style:italic;font-size:12px">No insights yet.</div>'}
    `;
  }

  // ─── Viz Pane ─────────────────────────────────────────────────────────────

  function buildVizPane() {
    const all        = getVizzes();
    const trail      = wikiTrail ?? [];
    const linkedUrls = new Set(trail.filter(e => e.kamiDocId === doc.identifier).map(e => e.url));
    const wikiViz    = all.filter(v => v.scope === 'wiki' && linkedUrls.has(v.scopeId));

    // ── Library section ──────────────────────────────────────────────────────
    let libraryHtml;
    if (vizLibrary === null) {
      libraryHtml = '<div style="color:#6b7280;font-style:italic;font-size:11px">Loading library…</div>';
    } else if (!vizLibrary.length) {
      libraryHtml = `<div style="color:#6b7280;font-size:11px;line-height:1.6">
        No entries in index.json yet.<br>
        Add HTML files to the repo then update
        <a href="${escHtml(VIZ_INDEX_URL)}" target="_blank" style="color:#6366f1">/index.json</a>.
      </div>`;
    } else {
      libraryHtml = vizLibrary.map(v => {
        const tags = (v.tags ?? []).map(t => `<span style="background:#2e3245;border-radius:3px;padding:1px 5px;font-size:9px;color:#9ca3af">${escHtml(t)}</span>`).join(' ');
        const desc = v.description ? `<div style="font-size:10px;color:#6b7280;margin-top:2px">${escHtml(v.description)}</div>` : '';
        return `
          <div class="krc-viz-card" data-lib-file="${escHtml(v.file)}">
            <div style="flex:1;min-width:0">
              <div class="krc-viz-label">${escHtml(v.concept)}</div>
              ${desc}
              ${tags ? `<div style="margin-top:4px;display:flex;gap:3px;flex-wrap:wrap">${tags}</div>` : ''}
            </div>
          </div>`;
      }).join('');
    }

    // ── Inherited from Wikipedia ──────────────────────────────────────────────
    const wikiSection = wikiViz.length
      ? wikiViz.map(v => `
          <div class="krc-viz-card" data-viz-id="${v.id}">
            <span class="krc-viz-label">${escHtml(v.concept)}</span>
            <span class="krc-viz-source">${escHtml(v.scopeLabel ?? 'Wikipedia')}</span>
          </div>`).join('')
      : '<div style="color:#6b7280;font-style:italic;font-size:11px">None inherited — add vizzes to linked Wikipedia pages.</div>';

    return `
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <div class="krc-section-label" style="margin-bottom:0">
            <a href="${escHtml(VIZ_LIBRARY_BASE)}" target="_blank" style="color:#6b7280;text-decoration:none">Library ↗</a>
          </div>
          <button class="krc-btn ghost" id="krc-viz-refresh-lib" style="padding:3px 10px;font-size:10px">↺ Sync</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">${libraryHtml}</div>
      </div>
      <hr class="krc-divider">
      <div>
        <div class="krc-section-label" style="margin-bottom:6px">Inherited from Wikipedia</div>
        <div style="display:flex;flex-direction:column;gap:6px">${wikiSection}</div>
      </div>
      <hr class="krc-divider">
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <div class="krc-section-label" style="margin-bottom:0">Generation prompt</div>
          <button class="krc-btn ghost" id="krc-viz-copy-prompt" style="padding:3px 10px;font-size:10px">Copy</button>
        </div>
        <pre id="krc-viz-prompt">${escHtml(VIZ_PROMPT)}</pre>
      </div>
    `;
  }

  // ─── History Pane ─────────────────────────────────────────────────────────

  function buildListPane() {
    if (!state.questions.length) {
      return `<div style="color:#6b7280;font-style:italic">No questions yet. Add one on the Q&A tab.</div>`;
    }
    const items = state.questions.map(q => `
      <div class="krc-question-item${q.id === state.activeId ? ' active' : ''}" data-id="${q.id}">
        <span class="krc-status-dot ${q.resolved ? 'resolved' : 'unresolved'}"></span>
        <span class="krc-question-title">${escHtml(q.title)}</span>
        <button class="krc-btn ghost" style="padding:3px 8px;font-size:11px" data-del="${q.id}">✕</button>
      </div>
    `).join('');
    return `<div id="krc-question-list">${items}</div>`;
  }

  // ─── Pane Event Binding ───────────────────────────────────────────────────

  function bindPaneEvents(which) {
    if (which === 'qa') {
      byId('krc-btn-import')?.addEventListener('click', addQuestion);
      byId('krc-q-text')?.addEventListener('input', e => {
        const q = currentQuestion();
        if (q) { q.question = e.target.value; scheduleSave(); }
      });
      byId('krc-rough')?.addEventListener('input', e => {
        const q = currentQuestion();
        if (q) { q.roughWork = e.target.value; scheduleSave(); }
      });
      byId('krc-notes-area')?.addEventListener('input', e => {
        const q = currentQuestion();
        if (q) { q.notes = e.target.value; scheduleSave(); }
      });
      byId('krc-btn-resolve')?.addEventListener('click', toggleResolved);
      byId('krc-btn-delete-q')?.addEventListener('click', () => {
        const q = currentQuestion();
        if (!q) return;
        state.questions = state.questions.filter(x => x.id !== q.id);
        state.activeId  = state.questions[0]?.id || null;
        scheduleSave();
        renderPane('qa');
      });
    }

    if (which === 'passages') {
      const copyPageBtn = byId('krc-btn-copy-page');
      if (copyPageBtn) {
        copyPageBtn.addEventListener('click', copyVisiblePageText);

        copyPageBtn.addEventListener('mouseover', () => {
          const layer = findBestTextLayer();
          if (!layer) return;
          const rect = layer.getBoundingClientRect();
          let ov = document.getElementById('krc-page-preview-ov');
          if (!ov) {
            ov = document.createElement('div');
            ov.id = 'krc-page-preview-ov';
            ov.style.cssText = [
              'position:fixed', 'pointer-events:none', 'z-index:999997',
              'border:2px solid rgba(99,102,241,0.75)',
              'background:rgba(99,102,241,0.07)',
              'border-radius:3px', 'transition:opacity 0.1s',
            ].join(';');
            document.body.appendChild(ov);
          }
          Object.assign(ov.style, {
            top: rect.top + 'px', left: rect.left + 'px',
            width: rect.width + 'px', height: rect.height + 'px',
            opacity: '1',
          });
        });

        copyPageBtn.addEventListener('mouseout', () => {
          document.getElementById('krc-page-preview-ov')?.remove();
        });
      }

      byId('krc-body').addEventListener('click', e => {
        // Copy button — copy text then navigate
        const copyBtn = e.target.closest('.krc-copy-passage');
        if (copyBtn) {
          const h = kamiHighlights[+copyBtn.dataset.passageIdx];
          if (!h) { setSyncBanner('err', '✕ Passage not found — try reloading the panel'); return; }
          const text = `[Page ${h.page ?? '?'} — Highlight]\n"${h.text}"${h.note ? '\n\nNote: ' + h.note : ''}`;
          copyToClipboard(text, '✓ Passage copied');
          scrollToPage(h.page);
          return;
        }
        // Card click (anywhere except the copy button) — navigate only
        const card = e.target.closest('.krc-passage-item');
        if (card) scrollToPage(kamiHighlights[+card.dataset.passageIdx]?.page);
      });
    }

    if (which === 'wiki') {
      byId('krc-wiki-refresh')?.addEventListener('click', () => {
        loadWikiTrail();
        renderPane('wiki');
      });
      byId('krc-body').addEventListener('click', e => {
        const unlinkBtn = e.target.closest('[data-unlink-url]');
        if (unlinkBtn) {
          const url   = decodeURIComponent(unlinkBtn.dataset.unlinkUrl);
          const docId = decodeURIComponent(unlinkBtn.dataset.unlinkDoc);
          wikiTrail = (wikiTrail || []).filter(x => !(x.url === url && x.kamiDocId === docId));
          try { gmSet('krc_wiki_trail', wikiTrail); } catch (_) { return; }
          renderPane('wiki');
          return;
        }
        const btn = e.target.closest('[data-copy-wiki]');
        if (!btn) return;
        copyToClipboard(decodeURIComponent(btn.dataset.copyWiki), '✓ Wikipedia highlight copied');
      });
    }

    if (which === 'insights') {
      byId('krc-btn-add-insight')?.addEventListener('click', addInsight);
      byId('krc-body').addEventListener('input', e => {
        if (!e.target.matches('.krc-insight-text')) return;
        const ins = state.insights.find(i => i.id === e.target.dataset.insightId);
        if (ins) { ins.text = e.target.value; scheduleSave(); }
      });
      byId('krc-body').addEventListener('click', e => {
        const id = e.target.dataset.delInsight;
        if (!id) return;
        state.insights = state.insights.filter(i => i.id !== id);
        scheduleSave(); renderPane('insights');
      });
    }

    if (which === 'viz') {
      byId('krc-viz-copy-prompt')?.addEventListener('click', () => {
        copyToClipboard(VIZ_PROMPT, '✓ Generation prompt copied');
      });

      byId('krc-viz-refresh-lib')?.addEventListener('click', () => {
        vizLibrary = null;
        loadVizLibrary();
        renderPane('viz');
      });

      byId('krc-body').addEventListener('click', e => {
        // Library card — open in float
        const libCard = e.target.closest('[data-lib-file]');
        if (libCard) {
          const file = libCard.dataset.libFile;
          const entry = vizLibrary?.find(v => v.file === file);
          if (entry) openVizFloat({ concept: entry.concept, rawUrl: VIZ_LIBRARY_BASE + entry.file });
          return;
        }
        // Wiki-inherited card
        const card = e.target.closest('[data-viz-id]');
        if (card) {
          const entry = getVizzes().find(v => v.id === card.dataset.vizId);
          if (entry) openVizFloat(entry);
        }
      });
    }

    if (which === 'list') {
      byId('krc-question-list')?.addEventListener('click', e => {
        const delId = e.target.closest('[data-del]')?.dataset.del;
        if (delId) {
          state.questions = state.questions.filter(q => q.id !== delId);
          if (state.activeId === delId) state.activeId = state.questions[0]?.id || null;
          scheduleSave(); renderPane('list');
          return;
        }
        const itemId = e.target.closest('[data-id]')?.dataset.id;
        if (itemId) {
          state.activeId = itemId;
          scheduleSave();
          document.querySelectorAll('.krc-tab').forEach(t => t.classList.remove('active'));
          document.querySelector('.krc-tab[data-tab="qa"]').classList.add('active');
          renderPane('qa');
        }
      });
    }
  }

  // ─── Question & Insight Management ───────────────────────────────────────

  function addQuestion() {
    const title    = (byId('krc-new-title')?.value || '').trim();
    const question = (byId('krc-import-q')?.value  || '').trim();
    if (!question) { setSyncBanner('warn', 'Write a question first.'); return; }

    const id = 'q_' + Date.now();
    state.questions.unshift({
      id,
      title    : title || question.slice(0, 50),
      question,
      roughWork: '', notes: '', resolved: false,
      updatedAt: new Date().toISOString(),
    });
    state.activeId = id;
    scheduleSave(); renderPane('qa');
  }

  function toggleResolved() {
    const q = currentQuestion();
    if (!q) return;
    q.resolved  = !q.resolved;
    q.updatedAt = new Date().toISOString();
    scheduleSave();
    const btn = byId('krc-btn-resolve');
    if (btn) {
      btn.textContent = q.resolved ? '✓ Resolved' : 'Mark as Resolved';
      btn.className   = q.resolved ? 'resolved'   : 'unresolved';
    }
  }

  function addInsight() {
    state.insights.push({ id: 'i_' + Date.now(), text: '', createdAt: new Date().toISOString() });
    scheduleSave(); renderPane('insights');
    const cards = byId('krc-body').querySelectorAll('.krc-insight-text');
    if (cards.length) cards[cards.length - 1].focus();
  }

  // ─── Page Text Copy ───────────────────────────────────────────────────────

  function findBestTextLayer() {
    const layers = Array.from(
      document.querySelectorAll('[id^="textLayer"][data-loaded="true"]')
    ).filter(el => el.children.length > 0);
    if (!layers.length) return null;
    const midY = window.innerHeight / 2;
    return layers.reduce((a, b) => {
      const aR = a.getBoundingClientRect();
      const bR = b.getBoundingClientRect();
      return Math.abs(aR.top + aR.height / 2 - midY) < Math.abs(bR.top + bR.height / 2 - midY) ? a : b;
    });
  }

  function copyVisiblePageText() {
    const best = findBestTextLayer();
    if (!best) {
      setSyncBanner('err', '✕ No loaded page text found — scroll to the page you want first');
      L.fail('copyVisiblePageText: no loaded textLayer elements found');
      return;
    }
    const pageNo = best.id.replace('textLayer', '');
    const words  = Array.from(best.querySelectorAll('.word')).map(s => s.textContent.trim()).filter(Boolean);
    if (!words.length) {
      setSyncBanner('err', `✕ Page ${pageNo} text layer loaded but empty — try a different page`);
      L.fail(`copyVisiblePageText: textLayer${pageNo} has no .word elements`);
      return;
    }
    const text = words.join(' ').replace(/\s+/g, ' ').trim();
    copyToClipboard(text, `✓ Page ${pageNo} text copied (${words.length} words)`);
  }

  // ─── Page Navigation ──────────────────────────────────────────────────────
  // Strategy: if the target textLayer is already in the DOM, scrollIntoView is
  // smooth and immediate. If lazy-loaded away, click Kami's own #gotopage{N}
  // menu item — it handles the viewer scroll internally regardless of distance.
  // The menu item works even while the menu is visually closed (display:none)
  // because Kami's event delegation fires on programmatic clicks too.

  function scrollToPage(pageNo) {
    if (!pageNo) return;

    const layer = document.getElementById('textLayer' + pageNo);
    if (layer && layer.children.length > 0) {
      // Page is loaded in the DOM — smooth scroll directly
      (layer.parentElement ?? layer).scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // Page is lazy-loaded away — delegate to Kami's navigation control
    const gotoBtn = document.getElementById('gotopage' + pageNo);
    if (gotoBtn) {
      gotoBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      L.info(`scrollToPage: navigated via Kami control to page ${pageNo}`);
      return;
    }

    // Last resort: drive the page number input field
    const input = document.getElementById('page-input-field');
    if (input) {
      input.value = pageNo;
      ['input', 'change'].forEach(ev =>
        input.dispatchEvent(new Event(ev, { bubbles: true }))
      );
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      L.warn(`scrollToPage: used input fallback for page ${pageNo} — gotopage element missing`);
      return;
    }

    setSyncBanner('err', `✕ Could not navigate to page ${pageNo} — Kami controls not found`);
    L.fail(`scrollToPage: no navigation pathway found for page ${pageNo}`);
  }

  // ─── Clipboard Helper ─────────────────────────────────────────────────────

  function copyToClipboard(text, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
      setSyncBanner('ok', successMsg);
      L.success(successMsg);
    }).catch(e => {
      setSyncBanner('err', `✕ Clipboard write failed: ${e.message}`);
      L.fail('copyToClipboard failed:', e.message);
    });
  }

  // ─── UI Helpers ───────────────────────────────────────────────────────────

  function setSaveStatus(msg) { const el = byId('krc-save-status'); if (el) el.textContent = msg; }
  function setSyncBanner(type, msg) {
    const el = byId('krc-sync-banner');
    if (!el) return;
    el.className = type; el.textContent = msg;
  }
  function byId(id)    { return document.getElementById(id); }
  function escHtml(s)  { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function activeTab() { return document.querySelector('.krc-tab.active')?.dataset.tab || 'qa'; }

  // ─── Boot ─────────────────────────────────────────────────────────────────

  function boot() {
    if (booted) { L.warn('boot() called twice — suppressing duplicate'); return; }
    booted = true;

    L.info('── KRC Boot ──────────────────────────────');

    installConsoleInterceptor();
    installFetchInterceptor();
    harvestCredsFromStorage();

    creds.clientId = crypto.randomUUID();
    L.warn('clientId defaulting to random UUID — will be replaced when Centrifuge connects');

    parseUrlFallback();

    // Write current doc to GM storage immediately with URL-parsed identity.
    // NOTABLEOPEN will overwrite with confirmed name once it fires.
    try {
      gmSet('krc_current_doc', { id: doc.identifier, name: doc.name || 'Unknown', timestamp: new Date().toISOString() });
    } catch (e) {
      L.warn('Could not set krc_current_doc on boot:', e.message);
    }

    buildPanel();

    if (doc.identifier) {
      loadState().catch(e => L.fail('loadState threw at boot:', e));
    } else {
      // NOTABLEOPEN fires asynchronously — poll until it sets doc.identifier,
      // then load state. Timeout after 12 seconds with a hard failure.
      setSyncBanner('warn', 'Waiting for document identity (NOTABLEOPEN)…');
      L.info('doc.identifier not yet available — polling for NOTABLEOPEN');
      const deadline = Date.now() + 12000;
      const waitTimer = setInterval(() => {
        if (doc.identifier) {
          clearInterval(waitTimer);
          L.success('doc.identifier available from NOTABLEOPEN —', doc.identifier);
          try {
            gmSet('krc_current_doc', { id: doc.identifier, name: doc.name || 'Unknown', timestamp: new Date().toISOString() });
          } catch (_) {}
          loadState().catch(e => L.fail('loadState threw after NOTABLEOPEN wait:', e));
        } else if (Date.now() > deadline) {
          clearInterval(waitTimer);
          FAIL('Document identity never resolved — NOTABLEOPEN did not fire within 12 s. Try reloading the page.');
        }
      }, 150);
    }

    L.info('── KRC Boot complete ─────────────────────');
  }

  // ─── Entry Point ──────────────────────────────────────────────────────────

  const observer = new MutationObserver((_, obs) => {
    if (document.getElementById('viewerContainer')) {
      obs.disconnect();
      setTimeout(boot, 800);
    }
  });

  if (document.getElementById('viewerContainer')) {
    setTimeout(boot, 800);
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ─── Wikipedia Companion ──────────────────────────────────────────────────
  // Runs only on en.wikipedia.org/wiki/* (routed at the top of the IIFE).
  // Responsibilities:
  //   - Read Glasp highlights from the DOM (<glasp> elements)
  //   - Provide a "Link to Kami" button that connects this page + highlights
  //     to the currently open Kami document (via GM_setValue)
  //   - All failures are visually loud — red banner at top of page

  function initWikipedia() {
    // ── Error display ──────────────────────────────────────────────────────
    // Failures here have no Kami panel to write to.
    // Insert a persistent red banner at the top of the Wikipedia page.

    function wikiError(msg) {
      console.error('%c[KRC-WIKI ✕]', 'color:#ef4444;font-size:13px;font-weight:bold', msg);
      let el = document.getElementById('krc-wiki-error-banner');
      if (!el) {
        el = document.createElement('div');
        el.id = 'krc-wiki-error-banner';
        el.style.cssText = [
          'position:fixed', 'top:0', 'left:0', 'right:0',
          'z-index:2147483647',
          'background:#3f0000', 'color:#ef4444',
          'font:700 12px/1.6 "Segoe UI",system-ui,sans-serif',
          'padding:10px 48px 10px 16px',
          'border-bottom:3px solid #ef4444',
          'white-space:pre-wrap', 'word-break:break-word',
          'cursor:pointer',
        ].join(';');
        const close = document.createElement('span');
        close.textContent = '✕';
        close.style.cssText = 'position:absolute;top:10px;right:14px;font-size:14px;cursor:pointer;';
        close.addEventListener('click', () => el.remove());
        el.appendChild(close);
        document.body.prepend(el);
      }
      // Prepend to existing messages rather than replacing them
      const existing = el.querySelector('.krc-wiki-error-text');
      if (existing) {
        existing.textContent = '[KRC] ' + msg + '\n' + existing.textContent;
      } else {
        const txt = document.createElement('span');
        txt.className = 'krc-wiki-error-text';
        txt.textContent = '[KRC] ' + msg;
        el.prepend(txt);
      }
    }

    // ── Glasp highlight reader ─────────────────────────────────────────────
    // Glasp wraps highlighted text in <glasp class="highlighter--highlighted …">
    // The selected text is the element's textContent.
    // Note and color live in data attributes on the element itself.

    function readGlaspHighlights() {
      const elems = document.querySelectorAll('glasp.highlighter--highlighted');
      if (!elems.length) {
        console.log('%c[KRC-WIKI]', 'color:#818cf8;font-weight:bold',
          'No Glasp highlights found on this page');
        return [];
      }

      // Glasp splits one logical highlight across multiple <glasp> elements
      // at DOM boundaries (links, formatted spans, etc.) — all fragments of
      // the same highlight share the same highlightid. Group and concatenate.
      const groups = new Map();
      Array.from(elems).forEach(el => {
        const id = el.getAttribute('highlightid');
        if (!id) return;
        if (!groups.has(id)) {
          groups.set(id, {
            highlightId : id,
            parts       : [],
            note        : el.getAttribute('data-glasp-note') || '',
            color       : el.getAttribute('data-color-id')  || '',
            capturedAt  : new Date().toISOString(),
          });
        }
        groups.get(id).parts.push(el.textContent);
      });

      const highlights = Array.from(groups.values()).map(g => ({
        highlightId : g.highlightId,
        // Join fragments, then clean up punctuation spacing introduced by the split
        text        : g.parts.join(' ')
                        .replace(/\s+/g, ' ')
                        .replace(/\s([,.)!?:;])/g, '$1')
                        .replace(/\(\s/g, '(')
                        .trim(),
        note        : g.note,
        color       : g.color,
        capturedAt  : g.capturedAt,
      })).filter(h => h.text.length > 0);

      console.log('%c[KRC-WIKI ✓]', 'color:#22c55e;font-weight:bold',
        `Read ${highlights.length} Glasp highlights (from ${elems.length} elements)`);
      return highlights;
    }

    // ── GM storage helpers (local to Wikipedia context) ───────────────────

    function wikiGmGet(key, fallback = null) {
      try {
        const val = GM_getValue(key, null);
        if (val === null || val === undefined) return fallback;
        if (typeof val === 'string') {
          try { return JSON.parse(val); } catch { return val; }
        }
        return val;
      } catch (e) {
        wikiError(`GM_getValue("${key}") failed: ${e.message}`);
        return fallback;
      }
    }

    function wikiGmSet(key, value) {
      try {
        GM_setValue(key, value);
      } catch (e) {
        wikiError(`GM_setValue("${key}") failed: ${e.message} — your link was NOT saved`);
        throw e;
      }
    }

    // ── Link to Kami ───────────────────────────────────────────────────────

    function linkToKami() {
      const kamiDoc = wikiGmGet('krc_current_doc', null);

      if (!kamiDoc || !kamiDoc.id) {
        wikiError(
          'No Kami document found in GM storage.\n' +
          'Open a paper in Kami first — the script updates the current doc on every Kami session load.'
        );
        return;
      }

      const highlights = readGlaspHighlights();
      const trail      = wikiGmGet('krc_wiki_trail', []);

      const entry = {
        kamiDocId   : kamiDoc.id,
        kamiDocName : kamiDoc.name ?? 'Unknown',
        url         : location.href,
        title       : document.title.replace(/\s*[-|].*Wikipedia.*$/i, '').trim(),
        linkedAt    : new Date().toISOString(),
        highlights,
      };

      // Replace existing entry for same URL + Kami doc (fresh snapshot)
      const filtered = trail.filter(e => !(e.url === entry.url && e.kamiDocId === entry.kamiDocId));
      filtered.unshift(entry);

      wikiGmSet('krc_wiki_trail', filtered);

      // Feedback on the button
      btn.textContent = `✓ Linked — "${entry.kamiDocName.slice(0, 28)}"`;
      btn.style.background = '#22c55e';
      btn.style.color      = '#000';
      setTimeout(() => {
        btn.style.color = '#fff';
        labelBtn();
      }, 3000);

      console.log('%c[KRC-WIKI ✓]', 'color:#22c55e;font-weight:bold',
        `Linked "${entry.title}" → Kami doc "${entry.kamiDocName}" with ${highlights.length} Glasp highlights`);
    }

    // ── Preview panel + Button ─────────────────────────────────────────────
    // Container holds both the collapsible preview and the button row.
    // Preview expands upward, shows every <glasp> element currently in the DOM.
    // A MutationObserver updates the count badge as Glasp loads highlights lazily.

    function escWiki(s) {
      return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    const container = document.createElement('div');
    container.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px',
      'z-index:2147483647',
      'display:flex', 'flex-direction:column', 'align-items:flex-end', 'gap:8px',
    ].join(';');

    // ── Preview panel ──────────────────────────────────────────────────────

    const preview = document.createElement('div');
    preview.style.cssText = [
      'background:#1a1d27', 'border:1px solid #2e3245', 'border-radius:10px',
      'width:300px', 'max-height:340px',
      'display:none', 'flex-direction:column',
      'font:12px/1.5 "Segoe UI",system-ui,sans-serif', 'color:#e2e4ed',
      'box-shadow:0 6px 24px rgba(0,0,0,.55)',
      'overflow:hidden',
    ].join(';');

    const previewHeader = document.createElement('div');
    previewHeader.style.cssText = [
      'padding:9px 12px', 'border-bottom:1px solid #2e3245',
      'display:flex', 'align-items:center', 'justify-content:space-between',
      'flex-shrink:0', 'background:#12141e',
    ].join(';');
    previewHeader.innerHTML = `
      <span style="font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#6b7280">Recognized Highlights</span>
      <button id="krc-wiki-prev-refresh" style="background:none;border:1px solid #2e3245;border-radius:4px;color:#6b7280;font-size:10px;padding:2px 7px;cursor:pointer">↺ Refresh</button>
    `;

    const previewList = document.createElement('div');
    previewList.id = 'krc-wiki-preview-list';
    previewList.style.cssText = [
      'overflow-y:auto', 'flex:1',
      'padding:8px 10px', 'display:flex', 'flex-direction:column', 'gap:6px',
    ].join(';');

    preview.appendChild(previewHeader);
    preview.appendChild(previewList);

    function hlCard(h, dimmed) {
      return `
        <div style="display:flex;gap:7px;align-items:flex-start;padding:4px 0;border-bottom:1px solid #1e2132;${dimmed ? 'opacity:0.65' : ''}">
          ${h.color ? `<span style="display:block;width:8px;height:8px;border-radius:50%;background:${escWiki(h.color)};flex-shrink:0;margin-top:4px"></span>` : '<span style="display:block;width:8px;flex-shrink:0"></span>'}
          <div style="flex:1;min-width:0">
            <div style="font-size:11px;color:#e2e4ed;word-break:break-word">${escWiki(h.text)}</div>
            ${h.note ? `<div style="font-size:10px;color:#9ca3af;font-style:italic;margin-top:2px">${escWiki(h.note)}</div>` : ''}
          </div>
        </div>`;
    }

    function sectionLabel(text) {
      return `<div style="font-size:9px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#4b5568;padding:6px 0 3px">${escWiki(text)}</div>`;
    }

    function populatePreview() {
      const live  = readGlaspHighlights();
      const trail = wikiGmGet('krc_wiki_trail', []);
      const saved = Array.isArray(trail) ? trail.filter(e => e.url === location.href) : [];

      let html = '';

      if (live.length) {
        html += sectionLabel(`Live · ${live.length} recognized`);
        html += live.map(h => hlCard(h, false)).join('');
      } else {
        html += `<div style="color:#6b7280;font-style:italic;font-size:11px;padding:4px 0">No Glasp highlights in DOM yet — Glasp may still be loading.</div>`;
      }

      saved.forEach(entry => {
        const hls = entry.highlights ?? [];
        if (!hls.length) return;
        const paper = entry.kamiDocName ? entry.kamiDocName.replace(/\.pdf$/i, '').slice(0, 28) : 'unknown paper';
        const date  = new Date(entry.linkedAt).toLocaleDateString();
        html += sectionLabel(`Saved · ${hls.length} · "${paper}" · ${date}${entry.recoveredFromExport ? ' · pasted' : ''}`);
        html += hls.map(h => hlCard(h, true)).join('');
      });

      if (!html) html = '<div style="color:#6b7280;font-style:italic;font-size:11px">Nothing here yet.</div>';

      previewList.innerHTML = html;
      updateBadge(live.length);
    }

    let previewOpen = false;
    function togglePreview() {
      previewOpen = !previewOpen;
      preview.style.display = previewOpen ? 'flex' : 'none';
      if (previewOpen) populatePreview();
    }

    previewHeader.querySelector('#krc-wiki-prev-refresh')
      .addEventListener('click', populatePreview);

    // ── Button row ─────────────────────────────────────────────────────────

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:6px;align-items:center';

    const badge = document.createElement('button');
    badge.textContent = '👁 0';
    badge.title = 'Preview recognized Glasp highlights';
    badge.style.cssText = [
      'background:#2e3245', 'color:#e2e4ed',
      'border:none', 'border-radius:8px',
      'padding:9px 10px',
      'font:600 11px/1 "Segoe UI",system-ui,sans-serif',
      'cursor:pointer',
      'box-shadow:0 2px 12px rgba(0,0,0,.35)',
      'transition:opacity .15s',
    ].join(';');
    badge.addEventListener('click', togglePreview);
    badge.addEventListener('mouseover', () => { badge.style.opacity = '0.8'; });
    badge.addEventListener('mouseout',  () => { badge.style.opacity = '1'; });

    function updateBadge(n) {
      badge.textContent = `👁 ${n}`;
      badge.style.background = n > 0 ? '#374151' : '#2e3245';
    }

    const btn = document.createElement('button');
    btn.textContent = '+ Link to Kami';
    btn.style.cssText = [
      'background:#6366f1', 'color:#fff',
      'border:none', 'border-radius:8px',
      'padding:9px 14px',
      'font:600 12px/1 "Segoe UI",system-ui,sans-serif',
      'cursor:pointer', 'letter-spacing:.04em',
      'box-shadow:0 2px 16px rgba(0,0,0,.35)',
      'transition:opacity .15s',
    ].join(';');
    btn.addEventListener('mouseover', () => { btn.style.opacity = '0.85'; });
    btn.addEventListener('mouseout',  () => { btn.style.opacity = '1'; });
    btn.addEventListener('click', () => {
      try { linkToKami(); }
      catch (e) { wikiError('Link failed: ' + e.message); }
    });

    btnRow.appendChild(badge);
    btnRow.appendChild(btn);
    container.appendChild(preview);
    container.appendChild(btnRow);

    // ── Glasp export recovery (kept as invisible as possible) ─────────────
    // Only needed to rescue existing highlights when Glasp DOM injection breaks.

    const recoverPanel = document.createElement('div');
    recoverPanel.style.cssText = [
      'background:#12141e', 'border:1px solid #2e3245', 'border-radius:8px',
      'padding:10px', 'display:none', 'flex-direction:column', 'gap:8px',
      'width:300px', 'box-shadow:0 4px 16px rgba(0,0,0,.45)',
      'font:12px/1.5 "Segoe UI",system-ui,sans-serif', 'color:#e2e4ed',
    ].join(';');

    const recoverArea = document.createElement('textarea');
    recoverArea.placeholder = 'Paste Glasp sidebar export…';
    recoverArea.style.cssText = [
      'width:100%', 'height:130px', 'background:#0e1018',
      'border:1px solid #2e3245', 'border-radius:6px', 'color:#e2e4ed',
      'font:11px/1.5 monospace', 'padding:6px 8px',
      'resize:vertical', 'box-sizing:border-box',
    ].join(';');

    const recoverBtns = document.createElement('div');
    recoverBtns.style.cssText = 'display:flex;gap:6px;';

    const recoverSave = document.createElement('button');
    recoverSave.textContent = 'Parse & save';
    recoverSave.style.cssText = 'flex:1;background:#6366f1;color:#fff;border:none;border-radius:6px;padding:6px 10px;font:600 11px/1 "Segoe UI",sans-serif;cursor:pointer;';

    const recoverCancel = document.createElement('button');
    recoverCancel.textContent = 'Cancel';
    recoverCancel.style.cssText = 'background:#2e3245;color:#e2e4ed;border:none;border-radius:6px;padding:6px 10px;font:600 11px/1 "Segoe UI",sans-serif;cursor:pointer;';

    const recoverStatus = document.createElement('div');
    recoverStatus.style.cssText = 'font-size:10px;color:#9ca3af;min-height:12px;';

    recoverBtns.appendChild(recoverSave);
    recoverBtns.appendChild(recoverCancel);
    recoverPanel.appendChild(recoverArea);
    recoverPanel.appendChild(recoverBtns);
    recoverPanel.appendChild(recoverStatus);

    const recoverToggle = document.createElement('div');
    recoverToggle.textContent = '↵ paste Glasp export';
    recoverToggle.style.cssText = [
      'font:10px/1 "Segoe UI",sans-serif', 'color:#374151',
      'cursor:pointer', 'text-align:right', 'margin-top:5px',
      'user-select:none', 'transition:color .1s',
    ].join(';');
    recoverToggle.addEventListener('mouseover', () => { recoverToggle.style.color = '#6b7280'; });
    recoverToggle.addEventListener('mouseout',  () => { recoverToggle.style.color = '#374151'; });

    // Preview div — shown between parse and confirm steps
    const recoverPreview = document.createElement('div');
    recoverPreview.style.cssText = [
      'display:none', 'flex-direction:column', 'gap:3px',
      'max-height:180px', 'overflow-y:auto',
    ].join(';');
    recoverPanel.insertBefore(recoverPreview, recoverBtns);

    let pendingHighlights = null; // parsed but not yet saved

    function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    function resetToInput() {
      pendingHighlights = null;
      recoverArea.style.display = '';
      recoverPreview.style.display = 'none';
      recoverPreview.innerHTML = '';
      recoverSave.textContent = 'Parse';
      recoverCancel.textContent = 'Cancel';
      recoverStatus.textContent = '';
      recoverStatus.style.color = '#9ca3af';
    }

    let recoverOpen = false;
    recoverToggle.addEventListener('click', () => {
      recoverOpen = !recoverOpen;
      recoverPanel.style.display = recoverOpen ? 'flex' : 'none';
      if (recoverOpen) { resetToInput(); recoverArea.focus(); }
    });
    recoverCancel.addEventListener('click', () => {
      if (pendingHighlights) {
        // "Back" — return to edit step
        resetToInput();
      } else {
        // "Cancel" — close entirely
        recoverOpen = false;
        recoverPanel.style.display = 'none';
        recoverArea.value = '';
        resetToInput();
      }
    });

    function parseGlaspExport(text) {
      const highlights = [];
      let current = null;
      for (const line of text.split('\n')) {
        const t = line.trim();
        if (t.startsWith('> ')) {
          if (current) highlights.push(current);
          current = {
            highlightId : 'krc_rec_' + Date.now() + '_' + highlights.length,
            text        : t.slice(2).trim(),
            note        : '',
            color       : '',
            capturedAt  : new Date().toISOString(),
            recovered   : true,
          };
        } else if (t.startsWith('- ') && current) {
          current.note = t.slice(2).trim();
        }
      }
      if (current) highlights.push(current);
      return highlights;
    }

    recoverSave.textContent = 'Parse';

    recoverSave.addEventListener('click', () => {
      if (!pendingHighlights) {
        // ── Step 1: parse and show preview ──────────────────────────────
        const raw = recoverArea.value.trim();
        if (!raw) { recoverStatus.textContent = 'Nothing pasted.'; return; }

        const highlights = parseGlaspExport(raw);
        if (!highlights.length) {
          recoverStatus.textContent = 'No highlights found — lines must start with >';
          return;
        }

        pendingHighlights = highlights;
        recoverArea.style.display = 'none';
        recoverPreview.innerHTML = highlights.map((h, i) => `
          <div style="background:#0e1018;border:1px solid #2e3245;border-radius:4px;padding:5px 8px;">
            <div style="font-size:9px;color:#6b7280;margin-bottom:2px">#${i + 1}</div>
            <div style="font-size:11px;color:#e2e4ed;line-height:1.5;word-break:break-word">${esc(h.text)}</div>
            ${h.note ? `<div style="font-size:10px;color:#9ca3af;font-style:italic;margin-top:3px;border-left:2px solid #2e3245;padding-left:5px">${esc(h.note)}</div>` : ''}
          </div>
        `).join('');
        recoverPreview.style.display = 'flex';
        recoverSave.textContent = `Save ${highlights.length} highlight${highlights.length !== 1 ? 's' : ''}`;
        recoverCancel.textContent = '← Back';
        recoverStatus.textContent = '';

      } else {
        // ── Step 2: confirmed — save ─────────────────────────────────────
        const kamiDoc = wikiGmGet('krc_current_doc', null);
        const trail   = wikiGmGet('krc_wiki_trail', []);
        const entry   = {
          kamiDocId          : kamiDoc?.id   ?? null,
          kamiDocName        : kamiDoc?.name ?? null,
          url                : location.href,
          title              : document.title.replace(/\s*[-|].*Wikipedia.*$/i, '').trim(),
          linkedAt           : new Date().toISOString(),
          highlights         : pendingHighlights,
          recoveredFromExport: true,
        };

        const filtered = trail.filter(e =>
          !(e.url === entry.url && e.kamiDocId === entry.kamiDocId)
        );
        filtered.unshift(entry);

        try {
          wikiGmSet('krc_wiki_trail', filtered);
          recoverStatus.textContent = `✓ Saved`;
          recoverStatus.style.color = '#22c55e';
          recoverArea.value = '';
          setTimeout(() => {
            recoverOpen = false;
            recoverPanel.style.display = 'none';
            resetToInput();
          }, 1200);
        } catch (e) {
          recoverStatus.textContent = `✕ ${e.message}`;
          recoverStatus.style.color = '#ef4444';
        }
      }
    });

    const historyLabel = document.createElement('div');
    historyLabel.style.cssText = 'font:10px/1.4 "Segoe UI",sans-serif;color:#4b5568;text-align:right;margin-top:4px;';

    function updateLinkHistory() {
      const trail   = wikiGmGet('krc_wiki_trail', []);
      const matches = Array.isArray(trail) ? trail.filter(e => e.url === location.href) : [];
      if (!matches.length) { historyLabel.textContent = ''; return; }
      const latest  = matches[0];
      const paper   = latest.kamiDocName
        ? `"${latest.kamiDocName.replace(/\.pdf$/i, '').slice(0, 22)}"`
        : 'a paper';
      const date    = new Date(latest.linkedAt).toLocaleDateString();
      const n       = (latest.highlights ?? []).length;
      historyLabel.textContent = `↳ ${n} hl · ${paper} · ${date}`;
    }

    const recoverWrapper = document.createElement('div');
    recoverWrapper.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;';
    recoverWrapper.appendChild(recoverPanel);
    recoverWrapper.appendChild(historyLabel);
    recoverWrapper.appendChild(recoverToggle);
    container.appendChild(recoverWrapper);

    // ── Wikipedia viz section ──────────────────────────────────────────────
    // Moderately visible — a regular feature, not emergency recovery.

    const wikiVizPanel = document.createElement('div');
    wikiVizPanel.style.cssText = [
      'background:#1a1d27', 'border:1px solid #2e3245', 'border-radius:10px',
      'width:300px', 'display:none', 'flex-direction:column', 'gap:8px',
      'padding:10px', 'font:12px/1.5 "Segoe UI",system-ui,sans-serif', 'color:#e2e4ed',
      'box-shadow:0 4px 20px rgba(0,0,0,.5)',
    ].join(';');

    const wikiVizList = document.createElement('div');
    wikiVizList.style.cssText = 'display:flex;flex-direction:column;gap:5px;';

    const wikiVizInputRow = document.createElement('div');
    wikiVizInputRow.style.cssText = 'display:flex;gap:5px;';

    const wikiVizGistInput = document.createElement('input');
    wikiVizGistInput.placeholder = 'Gist ID or URL';
    wikiVizGistInput.style.cssText = 'flex:1;background:#0e1018;border:1px solid #2e3245;border-radius:6px;color:#e2e4ed;font:11px "Segoe UI",sans-serif;padding:5px 7px;';

    const wikiVizConceptInput = document.createElement('input');
    wikiVizConceptInput.placeholder = 'Concept';
    wikiVizConceptInput.style.cssText = wikiVizGistInput.style.cssText;

    const wikiVizAddBtn = document.createElement('button');
    wikiVizAddBtn.textContent = 'Add';
    wikiVizAddBtn.style.cssText = 'background:#6366f1;color:#fff;border:none;border-radius:6px;padding:5px 10px;font:600 11px "Segoe UI",sans-serif;cursor:pointer;flex-shrink:0;';

    const wikiVizStatus = document.createElement('div');
    wikiVizStatus.style.cssText = 'font-size:10px;color:#9ca3af;min-height:12px;';

    wikiVizInputRow.appendChild(wikiVizGistInput);
    wikiVizInputRow.appendChild(wikiVizConceptInput);
    wikiVizPanel.appendChild(wikiVizList);
    wikiVizPanel.appendChild(wikiVizInputRow);
    wikiVizPanel.appendChild(wikiVizAddBtn);
    wikiVizPanel.appendChild(wikiVizStatus);

    function renderWikiVizList() {
      const all     = wikiGmGet('krc_viz', []) ?? [];
      const entries = Array.isArray(all) ? all.filter(v => v.scope === 'wiki' && v.scopeId === location.href) : [];
      wikiVizList.innerHTML = entries.length
        ? entries.map(v => `
            <div style="display:flex;align-items:center;gap:6px;background:#12141e;border:1px solid #2e3245;border-radius:5px;padding:5px 8px;cursor:pointer" data-wiki-viz-id="${v.id}">
              <span style="flex:1;font-size:11px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${escWiki(v.concept)}</span>
              <button style="background:none;border:1px solid #2e3245;border-radius:4px;color:#6b7280;font-size:10px;padding:1px 5px;cursor:pointer;flex-shrink:0" data-wiki-del-viz="${v.id}">✕</button>
            </div>`).join('')
        : `<div style="color:#6b7280;font-size:11px;font-style:italic">No visualizations for this page yet.</div>`;

      wikiVizList.addEventListener('click', e => {
        const delId = e.target.dataset.wikiDelViz;
        if (delId) {
          const vizzes = wikiGmGet('krc_viz', []) ?? [];
          wikiGmSet('krc_viz', Array.isArray(vizzes) ? vizzes.filter(v => v.id !== delId) : []);
          renderWikiVizList();
          return;
        }
        const card = e.target.closest('[data-wiki-viz-id]');
        if (card) {
          const all = wikiGmGet('krc_viz', []) ?? [];
          const entry = Array.isArray(all) ? all.find(v => v.id === card.dataset.wikiVizId) : null;
          if (entry) window.open(entry.rawUrl, '_blank');
        }
      }, { once: false });
    }

    wikiVizAddBtn.addEventListener('click', async () => {
      const gistInput = wikiVizGistInput.value.trim();
      const concept   = wikiVizConceptInput.value.trim() || 'Untitled';
      if (!gistInput) { wikiVizStatus.textContent = 'Paste a Gist ID or URL.'; wikiVizStatus.style.color = '#eab308'; return; }
      wikiVizStatus.textContent = 'Resolving…'; wikiVizStatus.style.color = '#9ca3af';
      try {
        // Use the same resolveGistUrl if available, else direct fetch
        const resp = await fetch(`https://api.github.com/gists/${gistInput.replace(/.*\/([a-f0-9]{20,})[^\/]*$/i, '$1')}`);
        if (!resp.ok) throw new Error(`GitHub API ${resp.status}`);
        const data  = await resp.json();
        const files = Object.values(data.files ?? {});
        const file  = files.find(f => /\.html?$/i.test(f.filename)) ?? files[0];
        if (!file) throw new Error('No files in Gist');
        const gistId = data.id;
        const rawUrl = file.raw_url.replace(/\/raw\/[a-f0-9]+\//, '/raw/');

        const all = wikiGmGet('krc_viz', []) ?? [];
        const vizzes = Array.isArray(all) ? all : [];
        vizzes.push({
          id       : 'viz_' + Date.now(),
          concept,
          gistId,
          rawUrl,
          scope    : 'wiki',
          scopeId  : location.href,
          scopeLabel: document.title.replace(/\s*[-|].*Wikipedia.*$/i, '').trim(),
          addedAt  : new Date().toISOString(),
        });
        wikiGmSet('krc_viz', vizzes);
        wikiVizStatus.textContent = `✓ Added "${concept}"`;
        wikiVizStatus.style.color = '#22c55e';
        wikiVizGistInput.value = '';
        wikiVizConceptInput.value = '';
        renderWikiVizList();
      } catch (e) {
        wikiVizStatus.textContent = `✕ ${e.message}`;
        wikiVizStatus.style.color = '#ef4444';
      }
    });

    const wikiVizToggle = document.createElement('button');
    wikiVizToggle.textContent = '⬡ Visualizations';
    wikiVizToggle.style.cssText = [
      'background:#1e2132', 'color:#9ca3af',
      'border:1px solid #2e3245', 'border-radius:8px',
      'padding:7px 12px', 'font:600 11px/1 "Segoe UI",system-ui,sans-serif',
      'cursor:pointer', 'letter-spacing:.03em',
      'box-shadow:0 2px 12px rgba(0,0,0,.3)',
      'transition:all .15s', 'width:100%', 'text-align:left',
    ].join(';');

    let wikiVizOpen = false;
    wikiVizToggle.addEventListener('click', () => {
      wikiVizOpen = !wikiVizOpen;
      wikiVizPanel.style.display = wikiVizOpen ? 'flex' : 'none';
      wikiVizToggle.style.color = wikiVizOpen ? '#6366f1' : '#9ca3af';
      wikiVizToggle.style.borderColor = wikiVizOpen ? '#6366f1' : '#2e3245';
      if (wikiVizOpen) renderWikiVizList();
    });

    const wikiVizWrapper = document.createElement('div');
    wikiVizWrapper.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
    wikiVizWrapper.appendChild(wikiVizPanel);
    wikiVizWrapper.appendChild(wikiVizToggle);
    container.appendChild(wikiVizWrapper);

    function labelBtn() {
      const kamiDoc = wikiGmGet('krc_current_doc', null);
      if (kamiDoc?.name) {
        const name = kamiDoc.name.replace(/\.pdf$/i, '').slice(0, 32);
        btn.textContent      = `+ Link to "${name}"`;
        btn.style.background = '#6366f1';
      } else {
        btn.textContent      = '+ Link to Kami — no paper open';
        btn.style.background = '#374151';
      }
    }

    function mountAll() {
      if (!document.body.contains(container)) document.body.appendChild(container);
      labelBtn();
      updateLinkHistory();
      updateBadge(document.querySelectorAll('glasp.highlighter--highlighted').length);

      // Glasp injects highlights asynchronously — poll briefly to catch them.
      // Stops as soon as highlights appear or after ~5 seconds.
      let checks = 0;
      const poll = setInterval(() => {
        const n = document.querySelectorAll('glasp.highlighter--highlighted').length;
        updateBadge(n);
        if (previewOpen) populatePreview();
        if (++checks >= 10 || n > 0) clearInterval(poll);
      }, 500);
    }

    if (document.body) {
      mountAll();
    } else {
      document.addEventListener('DOMContentLoaded', mountAll);
    }
  }

})();
