// ==UserScript==
// @name         LinkedIn Insight Mode
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Strips ego/social-proof signals (reaction/comment/repost counts, follower counts, notification badges, Promoted posts, verified badges, the profile-analytics widget) and reskins the feed into a calm reading layout. Every effect is a togglable CSS filter -- nothing is deleted or rewritten, so unchecking an item (or all of them) and reloading reproduces stock LinkedIn exactly.
// @match        https://www.linkedin.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
  'use strict';

  const VERSION = '1.1.0';
  const TAG = '[LIM]';
  const log  = (...a) => console.log('%c' + TAG, 'color:#0a66c2;font-weight:bold', ...a);
  const warn = (...a) => console.warn('%c' + TAG, 'color:#b8860b;font-weight:bold', ...a);
  const err  = (...a) => console.error('%c' + TAG, 'color:#c0392b;font-weight:bold', ...a);

  // Wraps a callback so one bad node/mutation logs loudly (with a name to
  // grep for) and gets skipped, instead of throwing an uncaught error that
  // silently aborts whatever forEach/for-loop it was called from -- which
  // would skip every remaining item in that batch with no indication why.
  function guard(name, fn) {
    return (...a) => {
      try { return fn(...a); }
      catch (e) { err(name, 'threw:', e); }
    };
  }

  // Running totals, purely for visibility -- call __limStats() in the
  // console at any time to see what's been tagged/hidden so far.
  const stats = { postsSeen: 0 };
  window.__limStats = () => {
    log('stats:', JSON.stringify(stats));
    log('contract violations (' + contractViolations.size + '):', [...contractViolations]);
    return stats;
  };

  // ─── Structural contracts ────────────────────────────────────────────────
  // Every selector/climb in this script is really a claim about LinkedIn's
  // DOM shape ("a post's control-menu button always has a [Comment] button
  // within N ancestors", "mainFeed's direct children are always either a
  // lazy-mount wrapper or the empty sentinel"). When live markup stops
  // matching one of those claims, the code that depends on it doesn't throw
  // -- it just quietly does nothing, which looks identical to "nothing to
  // do here" from the console. violate() turns that into a specific, loud,
  // deduplicated warning (once per distinct shape, not once per element) so
  // an actual markup change is visible the moment it happens instead of
  // surfacing later as "some posts are missing" with no clue why.
  const contractViolations = new Set();
  function violate(name, details) {
    const key = name + ':' + details;
    if (contractViolations.has(key)) return;
    contractViolations.add(key);
    warn('CONTRACT VIOLATION --', name, '--', details);
  }

  // componentkey alone turned out to be null on most of these elements
  // (confirmed via error.txt), making prior warnings useless for figuring
  // out what actually got tagged. This tries several identifying signals
  // in order of usefulness, falling back to a truncated HTML snippet so
  // there's always SOMETHING to look at even when every attribute is empty.
  function identify(el) {
    const ck = el.getAttribute('componentkey');
    if (ck) return 'componentkey=' + ck;
    const al = el.querySelector('[aria-label]');
    if (al) return 'aria-label=' + al.getAttribute('aria-label');
    const tid = el.querySelector('[data-testid]');
    if (tid) return 'data-testid=' + tid.getAttribute('data-testid');
    return 'html=' + el.innerHTML.slice(0, 150).replace(/\s+/g, ' ');
  }

  // ─── Settings ────────────────────────────────────────────────────────────
  // One JSON blob in storage. Every feature is a class on <html>; toggling
  // never touches LinkedIn's own DOM or data, only which CSS rules match.

  const DEFAULTS = {
    reskin:     true,   // reading-mode typography & layout
    counts:     true,   // reaction / comment / repost counts + reactor faces
    followers:  true,   // follower / connection counts
    badges:     true,   // verified / influencer badges
    notifbadge: true,   // numeric badges on top-nav icons
    promoted:   true,   // hide entire Promoted/sponsored posts
    analytics:  true,   // "Profile viewers N / View all analytics" widget
    sidebar:    true,   // confirmed via Sidebar2.html: your own left-rail profile/analytics card
    aside:      true,   // confirmed via news.html: right-rail news + LinkedIn's daily games widget
    topbar:     true,   // confirmed via TopBar3.html: logo, nav icons, "For Business", Premium upsell
    startpost:  true,   // confirmed via StartPost3.html: the "Start a post" composer box
    grid:       true,   // 3-column card grid instead of a single vertical column
    noAutoLoad: true,   // hide the infinite-scroll sentinel; load more via manual button only
    autoExpand: true,   // auto-click "...more"
    noAutoplay: true,   // pause video.js players on insert
  };

  // Tags handled by the JS-side inline-style redundancy below (see addIns).
  const TAG_TO_KEY = {
    counts: 'counts', followers: 'followers', badges: 'badges',
    notifbadge: 'notifbadge', analytics: 'analytics', promoted: 'promoted',
    topbar: 'topbar', startpost: 'startpost',
  };

  function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }
  const state = Object.assign({}, DEFAULTS, safeParse(GM_getValue('lim-settings', '{}')));
  function save() { GM_setValue('lim-settings', JSON.stringify(state)); }

  function applyClasses() {
    const cl = document.documentElement.classList;
    for (const k of Object.keys(DEFAULTS)) cl.toggle('ins-f-' + k, !!state[k]);
  }
  applyClasses();

  // ─── Stylesheet ──────────────────────────────────────────────────────────
  // Selectors key off data-ins-* attributes this script adds itself, or off
  // aria-label landmarks LinkedIn renders. Never class names: LinkedIn ships
  // fully hashed/atomic CSS classes (e.g. "_3bc34f41") that rotate on every
  // deploy, so a selector built on one would break almost immediately.

  const css = `
    html.ins-f-counts      [data-ins~="counts"]      { display: none !important; }
    html.ins-f-followers   [data-ins~="followers"]   { display: none !important; }
    html.ins-f-badges      [data-ins~="badges"]      { display: none !important; }
    html.ins-f-notifbadge  [data-ins~="notifbadge"]  { display: none !important; }
    html.ins-f-analytics   [data-ins~="analytics"]   { display: none !important; }
    html.ins-f-promoted    [data-ins~="promoted"]    { display: none !important; }
    html.ins-f-sidebar     [aria-label="Sidebar"]    { display: none !important; }
    html.ins-f-aside       [aria-label="Aside"]      { display: none !important; }
    html.ins-f-topbar      [data-ins~="topbar"]      { display: none !important; }
    html.ins-f-startpost   [data-ins~="startpost"]   { display: none !important; }

    /* Confirmed via current.html: LinkedIn scrolls inside <main id="workspace">,
       not the html/body/window -- an assumption the first pass got wrong.
       topbar/sidebar/startpost hides all change height inside that same
       container too, not just mainFeed, so this needs to sit on #workspace
       itself rather than one inner box. Harmless when every toggle above is
       off, since nothing would be resizing dynamically in that state anyway. */
    #workspace, html { overflow-anchor: none !important; }

    /* [data-testid="mainFeed"] is the real list root (role="list"). Its direct
       children are display:contents lazy-mount wrappers, which are transparent
       to CSS Grid -- so the actual post boxes get promoted straight into this
       grid without needing to be tagged individually. */
    /* mainFeed's own 1400px cap below is meaningless while everything above
       it is still constrained to single-column width. That constraint isn't
       max-width -- current.html shows main > div[style*="--_07610cf3: 24"] >
       div > section[Primary content], i.e. LinkedIn's layout is a CSS Grid
       (a 24-column design-system grid) and Primary content gets its width
       from a grid-column span, not from max-width at all. Covering width,
       grid-column, and flex together since the exact mechanism in play on
       any given element isn't knowable from static HTML -- properties that
       don't apply to a given element's actual layout mode are just ignored. */
    html.ins-f-grid main,
    html.ins-f-grid main > div,
    html.ins-f-grid main > div > div,
    html.ins-f-grid [aria-label="Primary content"] {
      max-width: none !important;
      width: 100% !important;
      grid-column: 1 / -1 !important;
      flex: 1 1 auto !important;
    }
    html.ins-f-grid [data-testid="mainFeed"] {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      /* Previously reverted this to default (row) flow because dense
         caused already-VISIBLE cards to relocate whenever an unrelated
         cell's span changed later (error.txt). Re-enabled now that
         tagNonPostCells hides every cell (setPendingHidden) until its
         classification is fully resolved, then reveals it once at its
         final span -- nothing visible ever changes span after appearing,
         so dense only ever affects content that's still arriving (normal
         "more is loading" reflow), not something you're already looking
         at. Without dense, grid2.html showed real accumulated dead space:
         a full-width item mid-row forces a new row without backfilling
         the 1-2 columns it left behind in the row before it. */
      grid-auto-flow: dense !important;
      gap: 20px !important;
      max-width: 1400px !important;
      margin: 0 auto !important;
    }
    /* mainFeed's infinite-scroll sentinel (an always-empty div, confirmed via
       current.html to be a direct child of mainFeed -- a sibling of the post
       wrappers, not nested inside one) gets pulled into the grid like any
       other child. Grid's default align-items:stretch would then stretch
       this should-always-be-0px div to match whatever row height it lands
       in next to a tall card, moving it in the viewport in a way LinkedIn's
       own IntersectionObserver never expected. Keep it full-width and
       unstretched so its position/size stays exactly what it would be in
       normal single-column flow. */
    html.ins-f-grid [data-testid="mainFeed"] > div:empty {
      grid-column: 1 / -1 !important;
      align-self: start !important;
    }
    /* Non-post content (ads, "suggested for you", job postings -- confirmed
       via some_rendered.html) was being squeezed into a 1/3-width grid cell
       its own internal layout was never built for, rendering broken/blank.
       This used to be a reactive :not(:has([data-ins-postroot])) selector,
       but that matches ANY cell lacking the tag -- including every post,
       for the brief window between DOM insertion and JS tagging catching
       up, causing every post to flash full-width then snap down to its
       real column the instant it got tagged. Now gated on an explicit
       JS-set data-ins-nonpost flag (see tagNonPostCells) instead, which is
       only ever true for confirmed non-post content -- posts are never
       matched by this rule at any point, regardless of tagging timing. */
    html.ins-f-grid [data-ins-nonpost] {
      grid-column: 1 / -1 !important;
    }
    /* A post whose content is entirely display:none (promoted) left its
       grid cell empty but still stretched to the row's height by Grid's
       default align-items:stretch -- see tagNonPostCells' cell-hidden pass. */
    html.ins-f-grid [data-ins-cell-hidden] {
      display: none !important;
    }
    /* A lazy-mount wrapper LinkedIn never mounted any content into at all --
       see tagNonPostCells' empty-wrapper pass. Confirmed via grid.html. */
    html.ins-f-grid [data-ins-empty-wrapper] {
      display: none !important;
    }
    /* LoadMore.html confirmed this same div (_9d763823 _94ecd70e _3b42afd3)
       is the one slot LinkedIn renders either empty (auto-triggers on
       intersection) or with a real "Load more" button (click-only, never
       auto-fires) -- same wrapper, two states. Hiding it while empty means
       it can never auto-trigger from passive scrolling; #lim-loadmore below
       briefly un-hides it and scrolls it into view to fire the same
       authentic trigger the real button uses, on demand only. */
    html.ins-f-noAutoLoad [data-testid="mainFeed"] > div:empty {
      display: none !important;
    }
    /* Untested hypothesis, not confirmed: problem1.html/problem2.html showed
       a fully-tagged, non-hidden, content-complete post (real text + image,
       no video) rendering completely blank while still occupying its grid
       cell -- can't be a hide-rule bug (checked: no promoted/nonpost/
       cell-hidden tags present). content-visibility:auto is a native CSS
       property built for exactly this "reserve layout space, skip painting
       contents until near-viewport" behavior on long feeds, and I can't
       rule it out from static HTML since it'd live in LinkedIn's external
       stylesheet, invisible to me the same way max-width was. If this is
       it, my own overflow:hidden/max-height on the post root could be
       confusing the browser's own containment/intersection math. Cheap,
       safe to force either way -- forcing "visible" only ever makes MORE
       content paint, never less. */
    html.ins-f-grid [data-testid="mainFeed"] [data-ins-postroot],
    html.ins-f-grid [data-testid="mainFeed"] [data-ins-postroot] * {
      content-visibility: visible !important;
    }
    html.ins-f-grid [data-ins-postroot] {
      max-width: none !important;
      margin: 0 !important;
      max-height: 420px !important;
      overflow: hidden !important;
      position: relative !important;
      border-radius: 8px !important;
    }
    html.ins-f-grid [data-ins-postroot]::after {
      content: "";
      position: absolute; left: 0; right: 0; bottom: 0; height: 64px;
      background: linear-gradient(to bottom, transparent, var(--ins-card-bg, #fffdf9));
      pointer-events: none;
    }
    /* Expanded cards used to grow past the 420px cap (max-height:none),
       which changed the card's footprint and forced dense to repack the
       whole grid around it on every expand/collapse -- stable, but still a
       visible reflow each time. Scrolling within the fixed-size card
       instead means the card's grid footprint literally never changes, so
       there's nothing for dense to repack: max-height stays at 420px from
       the base rule above, only overflow switches from hidden to auto. */
    html.ins-f-grid [data-ins-postroot][data-ins-expanded] {
      overflow-y: auto !important;
      overflow-x: hidden !important;
    }
    html.ins-f-grid [data-ins-postroot][data-ins-expanded]::after { display: none !important; }
    /* Even with the two JS fixes above, a card with comments loaded still
       looks structurally different from one without (avatars/reply-threads
       mixed into the 420px preview vs. clean post text) -- comments.html
       showed just how much markup one comment thread adds. Grid mode is
       about uniform scannable previews, so don't show comments there at
       all; the Comment button itself stays live for opening the post. */
    /* LinkedIn uses at least two different marker attributes for the same
       "display:contents wrapper" concept -- data-lazy-mount-id for lazily
       mounted items, and data-display-contents="true" for something else
       (confirmed via a CONTRACT VIOLATION log: a mainFeed direct child
       using the latter, invisible to every selector below that only
       checked for the former). Both need the same grid-column exemption
       or their content sits inside a wrapper CSS can't reach. */
    html.ins-f-grid [componentkey*="commentsSectionContainer"] {
      display: none !important;
    }

    html.ins-f-reskin body { background: #f6f4ef !important; }
    html.ins-f-reskin [aria-label="Primary content"] { background: transparent !important; }
    html.ins-f-reskin [data-ins-postroot] {
      font-family: Charter, Georgia, "Iowan Old Style", serif !important;
      font-size: 17px !important;
      line-height: 1.6 !important;
      background: #fffdf9 !important;
      --ins-card-bg: #fffdf9;
      max-width: 680px !important;
      margin: 0 auto 20px auto !important;
      padding: 28px 32px !important;
      border: none !important;
      border-radius: 2px !important;
      box-shadow: none !important;
    }
    html.ins-f-reskin [data-ins-postroot] * { box-shadow: none !important; }
    html.ins-f-reskin [data-ins-byline] {
      font-size: 13px !important;
      color: #8a8578 !important;
      font-family: -apple-system, sans-serif !important;
    }

    /* bottom-right is where LinkedIn's own messaging/chat widget lives --
       this was very likely rendering underneath it the whole time. */
    #lim-panel { position: fixed; z-index: 2147483647; left: 16px; bottom: 16px; font-family: -apple-system, sans-serif; }
    #lim-toggle { width: 40px; height: 40px; border-radius: 50%; border: none; background: #0a66c2; color: #fff; font-size: 18px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.25); }
    #lim-body { position: absolute; bottom: 48px; left: 0; width: 320px; background: #fff; color: #222; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,.3); padding: 16px; max-height: 70vh; overflow-y: auto; }
    #lim-body h3 { margin: 0 0 8px; font-size: 15px; }
    #lim-body .lim-note { font-size: 12px; color: #666; margin: 0 0 12px; line-height: 1.4; }
    #lim-body label { display: block; font-size: 13px; margin: 6px 0; cursor: pointer; }
  `;
  const styleEl = document.createElement('style');
  styleEl.id = 'lim-style';
  styleEl.textContent = css;
  (document.head || document.documentElement).appendChild(styleEl);

  // ─── Tagging pass ────────────────────────────────────────────────────────
  // Marks matches with data-ins attributes. Tagging always runs regardless
  // of toggle state -- it's inert without the html.ins-f-* class, so it
  // never changes what stock LinkedIn looks like.

  const REACTION_RE = /^[\d,]+\s*reactions?$/i;
  // LinkedIn renders these inconsistently -- sometimes as an aria-label on a
  // button, sometimes as plain visible text in a bare div. Matching is done
  // against both the aria-label AND the textContent of every leaf, on any
  // tag, rather than assuming one markup shape or a fixed set of tag names.
  const STAT_RE = /^[\d,]+\s*(comments?|reposts?)$/i;
  const FOLLOW_RE = /^[\d,]+\+?\s*(followers|connections)$/i;
  const NOTIF_RE = /,\s*\d+\s*new notifications?$/i;

  // Belt-and-suspenders: besides the html.ins-f-* / [data-ins~=] stylesheet
  // gate, every tagged element also gets an inline !important display set
  // directly, so hiding doesn't depend on the injected <style> surviving
  // whatever LinkedIn's own head/DOM management does after hydration.
  function applyHideState(el) {
    const tags = (el.getAttribute('data-ins') || '').split(' ').filter(Boolean);
    const hide = tags.some(t => state[TAG_TO_KEY[t]]);
    el.style.setProperty('display', hide ? 'none' : '', hide ? 'important' : '');
  }

  function addIns(el, tag) {
    const cur = el.getAttribute('data-ins') || '';
    if (!cur.split(' ').includes(tag)) {
      el.setAttribute('data-ins', (cur + ' ' + tag).trim());
      stats[tag] = (stats[tag] || 0) + 1;
    }
    applyHideState(el);
  }
  function isLeaf(el) { return el.children.length === 0; }

  // comments.html confirmed a comment's own text-truncation button shares the
  // same data-testid="expandable-text-button" as a post's -- without this
  // check, expanding one comment's "...more" would unclip the whole post
  // card to full height via the listener below, breaking grid uniformity
  // for a reason that has nothing to do with the post's own content.
  function inComments(el) {
    return !!el.closest('[data-testid*="commentList"], [componentkey*="commentsSectionContainer"]');
  }

  // root.querySelectorAll only searches DESCENDANTS -- if a MutationObserver
  // delivers the target element itself as the added node (rather than some
  // wrapper around it), a plain querySelectorAll silently misses it. This
  // checks the root itself too.
  function queryIncludingSelf(root, selector) {
    const out = root.matches && root.matches(selector) ? [root] : [];
    if (root.querySelectorAll) out.push(...root.querySelectorAll(selector));
    return out;
  }

  function climbStatsRow(leaf) {
    // Climb only while the ancestor's subtree doesn't yet contain the real
    // action-bar buttons, so a wide stats-row wrapper (varies by markup
    // variant) never ends up swallowing Like/Comment/Repost themselves.
    let candidate = leaf, el = leaf;
    for (let i = 0; i < 4 && el.parentElement; i++) {
      el = el.parentElement;
      if (el.querySelector('[aria-label="Comment"]') || el.querySelector('[aria-label="Repost"]')) break;
      candidate = el;
    }
    return candidate;
  }

  function tagPostRoot(root, authorName) {
    if (root.dataset.insPostroot) return;
    root.setAttribute('data-ins-postroot', '1');
    stats.postsSeen++;

    let bylineDone = false;
    for (const el of root.querySelectorAll('*')) {
      const label = el.getAttribute('aria-label');
      const text = isLeaf(el) ? el.textContent.trim() : '';

      if (!bylineDone && authorName && text === authorName) {
        el.setAttribute('data-ins-byline', '1');
        bylineDone = true;
      }
      // Exact-match only, so a post whose own text happens to contain the
      // word "Promoted" doesn't get swept up.
      if (text === 'Promoted') addIns(root, 'promoted');

      if ((label && REACTION_RE.test(label)) || REACTION_RE.test(text)) {
        addIns(climbStatsRow(el), 'counts');
      } else if (label === 'Open reactions menu') {
        addIns(el, 'counts');
      } else if (label && / Verified$/.test(label)) {
        addIns(el, 'badges');
      } else if ((label && STAT_RE.test(label)) || STAT_RE.test(text)) {
        addIns(el, 'counts');
      }
    }
  }

  function scanFollowersAndNotifs(node) {
    // Follower counts and notification badges appear outside post cards too
    // (company pages, nav, "People you may know"), so this walks whatever
    // subtree was just inserted rather than being scoped to one post.
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
    let el = node.nodeType === 1 ? node : walker.nextNode();
    while (el) {
      if (isLeaf(el) && FOLLOW_RE.test(el.textContent.trim())) addIns(el, 'followers');
      const label = el.getAttribute && el.getAttribute('aria-label');
      if (label) {
        if (NOTIF_RE.test(label)) {
          for (const child of el.querySelectorAll('span,div')) {
            if (isLeaf(child) && /^\d+$/.test(child.textContent.trim())) addIns(child, 'notifbadge');
          }
        }
        if (/^Profile viewers/.test(label) || /^View all analytics/.test(label)) {
          addIns(el.closest('a') || el, 'analytics');
        }
      }
      el = walker.nextNode();
    }
  }

  function tagTopbar(root) {
    // Each landmark is swept independently (rather than "find the nav
    // container, then search inside it") because LinkedIn's React app can
    // deliver any of these as its own standalone mutation -- requiring the
    // container to already be present in the same pass missed nodes that
    // arrived nested one level differently than expected.
    queryIncludingSelf(root, 'nav').forEach(n => { if (n.closest('header')) addIns(n, 'topbar'); });
    queryIncludingSelf(root, '[aria-label="For Business"]').forEach(el => addIns(el, 'topbar'));
    queryIncludingSelf(root, 'a[href*="/premium/"]').forEach(el => { if (el.closest('header')) addIns(el, 'topbar'); });
    // The LinkedIn logo also shows up outside the topbar (e.g. next to the
    // "Start a post" composer), so this one isn't header-scoped at all.
    queryIncludingSelf(root, '[aria-label="LinkedIn"]').forEach(el => addIns(el, 'topbar'));
  }

  // Interfere.html and unvisible.html both traced back to the same wrong
  // assumption: exactly one display:contents layer between mainFeed's
  // direct child and the real box CSS Grid actually promotes as the grid
  // item. Some content (ads/promo cards at least) nests a SECOND layer --
  // data-lazy-mount-id wrapping a data-display-contents="true" wrapping the
  // real box. A fixed one-level-deep selector tags the outer (boxless)
  // wrapper, so grid-column/display overrides silently have nothing to
  // apply to. This walks down through however many recognized wrapper
  // layers actually exist instead of assuming a fixed depth.
  function unwrapDisplayContents(el) {
    while (el && el.children.length === 1 && el.matches('[data-lazy-mount-id], [data-display-contents="true"]')) {
      el = el.firstElementChild;
    }
    return el;
  }

  // Toggles a wrapper's own visibility independent of the data-ins~= gate
  // system (which is keyed on toggle state, not classification state).
  // Used so an unclassified cell never renders with a span that later
  // changes -- see tagNonPostCells for why that matters with dense packing.
  function setPendingHidden(wrapper, hidden) {
    if (hidden) wrapper.style.setProperty('display', 'none', 'important');
    else wrapper.style.removeProperty('display');
  }

  function tagNonPostCells(root) {
    queryIncludingSelf(root, '[data-testid="mainFeed"] > *').forEach(wrapper => {
      if (!wrapper.matches('[data-lazy-mount-id], [data-display-contents="true"]')) return; // sentinel, not a content wrapper
      if (wrapper.dataset.insCellPending || wrapper.dataset.insResolved) return;

      if (wrapper.children.length === 0) {
        // Confirmed via grid.html: some lazy-mount wrappers never receive
        // ANY content -- not "hasn't hydrated its post button yet" (that's
        // the case below), literally nothing was ever mounted into this
        // slot. Most likely the same density-mismatch mechanism as the
        // sentinel bug: LinkedIn's own "is this visible enough to render"
        // check still assumes single-column height, so a slot that's
        // genuinely on-screen in this denser grid can look off-screen to
        // LinkedIn and never get content. Can't force LinkedIn to mount it,
        // but can stop it from sitting there as a blank hole -- hide while
        // waiting, and if content never arrives, leave it hidden for good
        // instead of showing nothing where a card should be.
        setPendingHidden(wrapper, true);
        wrapper.dataset.insCellPending = '1';
        setTimeout(() => {
          delete wrapper.dataset.insCellPending;
          if (wrapper.children.length === 0) {
            wrapper.dataset.insResolved = '1';
            wrapper.setAttribute('data-ins-empty-wrapper', '1');
            warn('lazy-mount wrapper never received content -- hid the empty slot:', identify(wrapper));
          } else {
            setPendingHidden(wrapper, false);
            // Content arrived meanwhile: reveal it now, a later scan() pass
            // (triggered by the mutation that added it) classifies it
            // properly as post/non-post from here.
          }
        }, 2500);
        return;
      }

      const cell = unwrapDisplayContents(wrapper);
      if (cell === wrapper && wrapper.children.length !== 1) {
        setPendingHidden(wrapper, true); // multiple/weird children shape, not settled yet
        return;
      }
      if (cell.dataset.insNonpostChecked || cell.dataset.insCellHiddenChecked) return;

      const hasPostButton = cell.querySelector('[aria-label^="Open control menu for post by "]');
      if (hasPostButton) {
        // Real post: reveal immediately rather than gating behind a grace
        // period like the branches below -- posts are the common case, and
        // making every single one flash-hidden before appearing would add
        // visible pop-in lag for the majority of the grid. If it turns out
        // to be promoted, the cell-hidden check below re-hides it a moment
        // later; that's one card's own display flipping, not a span change
        // rippling through neighbors the way the original dense bug did.
        wrapper.dataset.insResolved = '1';
        setPendingHidden(wrapper, false);
        // If it ends up fully hidden (promoted), the CELL needs to collapse
        // too, not just its content several levels deeper -- confirmed via
        // unvisible.html that display:none on the post-root alone leaves
        // grid's default align-items:stretch holding the empty cell open
        // to the row's full height, taking up a column while showing
        // nothing. Same grace-period pattern: give the promoted-post
        // detection a moment to actually run before checking.
        wrapper.dataset.insCellPending = '1';
        setTimeout(() => {
          delete wrapper.dataset.insCellPending;
          cell.dataset.insCellHiddenChecked = '1';
          const hiddenPostroot = cell.querySelector('[data-ins-postroot][data-ins~="promoted"]');
          if (hiddenPostroot) {
            cell.setAttribute('data-ins-cell-hidden', '1');
            warn('post-root is display:none (promoted) but its grid cell was not -- collapsed the cell too:', identify(cell));
          }
        }, 800);
        return;
      }

      // Confirmed via test.html: committing "non-post" on the FIRST miss
      // was a real bug, not just a theoretical race. LinkedIn's virtualizer
      // can still be hydrating a post (button not attached yet) at the
      // exact moment scan() fires -- especially right after reload, when
      // dozens of posts insert in rapid succession -- and a one-shot check
      // with no retry permanently froze a real post as full-width non-post
      // the instant its button was a few ms late. Don't commit immediately:
      // note the miss, hide while waiting (see setPendingHidden above), and
      // check again after a grace period.
      setPendingHidden(wrapper, true);
      wrapper.dataset.insCellPending = '1';
      setTimeout(() => {
        delete wrapper.dataset.insCellPending;
        wrapper.dataset.insResolved = '1';
        if (cell.dataset.insNonpostChecked) { setPendingHidden(wrapper, false); return; }
        if (cell.querySelector('[aria-label^="Open control menu for post by "]')) {
          setPendingHidden(wrapper, false);
          log('non-post grace period: button showed up late, released as a normal post', identify(cell));
          return;
        }
        cell.dataset.insNonpostChecked = '1';
        cell.setAttribute('data-ins-nonpost', '1');
        setPendingHidden(wrapper, false);
        warn('tagged non-post (forced full-width):', identify(cell), '-- descendants:', cell.querySelectorAll('*').length);
      }, 800);
    });
  }

  function tagStartPost(root) {
    const btn = queryIncludingSelf(root, '[aria-label="Start a post"]')[0];
    if (!btn || btn.dataset.insSeen) return;
    btn.dataset.insSeen = '1';
    let el = btn, hops = 0;
    while (el && el !== document.body) {
      if (el.querySelector('a[href*="detourType=VIDEO"]')) {
        addIns(el, 'startpost');
        return;
      }
      el = el.parentElement;
      hops++;
    }
    violate('start-post climb', `no ancestor with a VIDEO-detour link found within ${hops} hops -- startpost hide is not applying`);
  }

  // mainFeed's direct children are claimed to always be one of three known
  // shapes: a data-lazy-mount-id wrapper, a data-display-contents="true"
  // wrapper (confirmed via error.txt to be a real, distinct second variant
  // of the same "display:contents" concept), or the empty sentinel div.
  // Anything else is a structural surprise nothing in this script accounts
  // for -- it would render as a plain, unstyled 1-column grid cell with
  // none of the width-fix/hide logic applied, and nothing would say so
  // unless this checks for it explicitly. Runs on a delay for the same
  // reason tagNonPostCells does: give hydration a moment before judging.
  function checkMainFeedShape(root) {
    queryIncludingSelf(root, '[data-testid="mainFeed"] > *').forEach(child => {
      if (child.dataset.insShapeChecked || child.dataset.insShapePending) return;
      child.dataset.insShapePending = '1';
      setTimeout(() => {
        delete child.dataset.insShapePending;
        child.dataset.insShapeChecked = '1';
        const isWrapper = child.matches('div[data-lazy-mount-id], div[data-display-contents="true"]');
        const isSentinel = child.tagName === 'DIV' && child.children.length === 0;
        if (!isWrapper && !isSentinel) {
          violate('mainFeed direct child shape', `<${child.tagName.toLowerCase()}> class="${(child.className || '').slice(0, 60)}" children=${child.children.length} ${identify(child)}`);
        } else if (isWrapper && child.children.length > 1) {
          violate('wrapper child count', `expected 1 child, found ${child.children.length} (${identify(child)})`);
        }
      }, 800);
    });
  }

  function scan(root) {
    if (root.nodeType !== 1) return;

    tagTopbar(root);
    tagStartPost(root);

    queryIncludingSelf(root, '[aria-label^="Open control menu for post by "]').forEach(btn => {
      if (btn.dataset.insSeen) return;
      btn.dataset.insSeen = '1';
      const m = btn.getAttribute('aria-label').match(/^Open control menu for post by (.+)$/);
      const author = m && m[1];
      let el = btn, hops = 0;
      while (el && el !== document.body) {
        if (el.querySelector('[aria-label="Comment"]')) {
          tagPostRoot(el, author);
          return;
        }
        el = el.parentElement;
        hops++;
      }
      violate('post-root climb', `no ancestor with [aria-label="Comment"] found for post by "${author}" within ${hops} hops -- this post got no card styling, no counts/badges/promoted hiding, nothing`);
    });

    tagNonPostCells(root);
    checkMainFeedShape(root);
    scanFollowersAndNotifs(root);

    if (state.autoExpand) {
      // Skip comments here too -- not just to avoid the unclip escape above,
      // but because auto-expanding comment text mixes comment snippets into
      // the clipped card preview alongside the post's own text, making cards
      // with visible comments look structurally different from ones without.
      queryIncludingSelf(root, '[data-testid="expandable-text-button"]').forEach(b => {
        if (b.dataset.insClicked || inComments(b)) return;
        b.dataset.insClicked = '1';
        // Dispatched synchronously -- the flag is read by the click listener
        // below (added once, outside scan()) so this programmatic click
        // doesn't also get treated as the user manually asking to expand
        // past the grid card's height cap.
        autoClicking = true;
        b.click();
        autoClicking = false;
      });
    }
    if (state.noAutoplay) {
      queryIncludingSelf(root, 'video').forEach(v => { if (!v.paused) v.pause(); });
    }
    logSentinelState();
    if (document.body) buildPanel();
  }

  // Set/cleared synchronously around the autoExpand programmatic click above.
  let autoClicking = false;

  // Capture phase so this fires regardless of what LinkedIn's own handlers do
  // with the event, and whether the click landed on the button (aria-hidden,
  // pointer-events:none) or the inner span that actually receives the click.
  // Only a real user click should escape the grid card's height cap --
  // autoExpand's own synthetic click is excluded via the flag above, since
  // dispatchEvent/click() bubbles here too and would otherwise unclip nearly
  // every card in grid mode the moment autoExpand ran on it.
  document.addEventListener('click', guard('expand-click-listener', (e) => {
    if (autoClicking) return;
    const btn = e.target.closest && e.target.closest('[data-testid="expandable-text-button"]');
    if (!btn || inComments(btn)) return;
    const post = btn.closest('[data-ins-postroot]');
    if (post) post.setAttribute('data-ins-expanded', '1');
  }), true);

  // Click-anywhere-on-the-card toggle, grid mode only. Needed because
  // autoExpand consumes LinkedIn's real "...more" button on load (it
  // disappears once text is expanded), so by the time a card is visible
  // there's often nothing left for the listener above to hook into -- the
  // fade shows correctly but there's no native trigger left to click.
  // Excludes real interactive elements (links, buttons, avatars) so it
  // doesn't fight normal card usage, and bails if the click was actually
  // the end of a text-selection drag rather than a real click.
  document.addEventListener('click', guard('card-click-expand-toggle', (e) => {
    if (!state.grid) return;
    if (e.target.closest('a, button, [role="button"], input, textarea, [contenteditable]')) return;
    if (window.getSelection().toString().length > 0) return;
    const post = e.target.closest('[data-ins-postroot]');
    if (!post) return;
    if (post.hasAttribute('data-ins-expanded')) post.removeAttribute('data-ins-expanded');
    else post.setAttribute('data-ins-expanded', '1');
  }));

  // Briefly reveals the real sentinel(s) and scrolls one into view so
  // LinkedIn's own already-attached IntersectionObserver fires its normal
  // load -- the same authentic trigger the real "Load more" button uses --
  // then hides them again so it can't keep auto-firing from passive scroll.
  function triggerManualLoad(scrollToSentinel = true) {
    const sentinels = document.querySelectorAll('[data-testid="mainFeed"] > div:empty');
    log('manual load requested, sentinels found:', sentinels.length);
    sentinels.forEach(el => el.style.setProperty('display', 'block', 'important'));
    // Skip when called from the pull-past-edge gesture: that only fires
    // once already scrolled to the bottom, so forcing scrollIntoView there
    // just recenters/jumps the viewport on every trigger for no reason --
    // that was the "scrollbar resets each time" chaos. Still needed for the
    // panel button, which can be clicked from anywhere on the page.
    if (scrollToSentinel && sentinels[0]) sentinels[0].scrollIntoView({ block: 'center' });
    setTimeout(() => {
      sentinels.forEach(el => el.style.removeProperty('display'));
      log('sentinels re-hidden');
    }, 3000);
  }

  // "Scroll past the bottom edge to load more" -- deliberately NOT wired to
  // the real sentinel's position the way the original auto-load was (that's
  // exactly what broke: passive scrolling near the sentinel, made way more
  // frequent by the grid's density, fired it constantly). This only tracks
  // continued downward wheel intent after #workspace has already hit its
  // scroll ceiling, accumulating a "pull" distance and resetting the moment
  // either the user stops or isn't at the bottom -- so it can only ever
  // fire from a deliberate "keep pushing past the edge" gesture, never from
  // ordinary scrolling through content, regardless of grid density.
  let pullDistance = 0, pullLastTime = 0;
  document.addEventListener('wheel', guard('pull-to-load', (e) => {
    if (!state.noAutoLoad) return; // only relevant when the sentinel itself is suppressed
    const ws = document.getElementById('workspace');
    if (!ws) return;
    const atBottom = ws.scrollTop + ws.clientHeight >= ws.scrollHeight - 4;
    if (!atBottom || e.deltaY <= 0) { pullDistance = 0; return; }
    const now = Date.now();
    if (now - pullLastTime > 500) pullDistance = 0; // paused too long, restart the gesture
    pullLastTime = now;
    pullDistance += e.deltaY;
    if (pullDistance > 250) {
      pullDistance = 0;
      log('pull-past-edge threshold reached, loading more');
      triggerManualLoad(false);
    }
  }), { passive: true });

  // Diagnostic only -- logs when the sentinel's empty/button state flips, so
  // opening the browser console and watching this shows exactly when
  // LinkedIn's own auto-load-vs-manual-button mode changes, instead of
  // guessing from a static HTML snapshot after the fact.
  let lastSentinelEmpty = null;
  function logSentinelState() {
    const s = document.querySelector('[data-testid="mainFeed"] > div._9d763823._94ecd70e._3b42afd3');
    if (!s) return;
    const empty = s.children.length === 0;
    if (empty !== lastSentinelEmpty) {
      lastSentinelEmpty = empty;
      log('sentinel mode ->', empty ? 'EMPTY (auto-trigger capable)' : 'BUTTON (manual only)');
    }
  }

  // ─── Control panel ───────────────────────────────────────────────────────
  // Defined here, before the first scan() call below, because scan() itself
  // calls buildPanel() -- and buildPanel()'s body reads LABELS. LABELS is a
  // const (not hoisted with a value the way the buildPanel function
  // declaration is), so calling scan() before this point would throw
  // "Cannot access 'LABELS' before initialization" the moment document.body
  // already exists at the very first scan() call.

  const LABELS = {
    reskin:     'Reading-mode layout (typography, spacing, calm background)',
    counts:     'Hide reaction / comment / repost counts + reactor faces',
    followers:  'Hide follower / connection counts',
    badges:     'Hide verified / influencer badges',
    notifbadge: 'Hide notification badge numbers',
    promoted:   'Hide Promoted / sponsored posts entirely',
    analytics:  'Hide "Profile viewers / analytics" widget',
    sidebar:    'Hide your profile/analytics sidebar card entirely',
    aside:      'Hide right-rail news & games widget',
    topbar:     'Hide topbar logo/nav/ads (keeps search)',
    startpost:  'Hide the "Start a post" composer box',
    grid:       '3-column card grid (YouTube-style) instead of one column',
    noAutoLoad: 'Pause auto-loading (use the Load More button instead)',
    autoExpand: 'Auto-expand "...more"',
    noAutoplay: 'Pause autoplay video',
  };

  function buildPanel() {
    // Guards against the panel getting built twice -- Tampermonkey injects
    // into every same-origin frame matching @match, and LinkedIn's chat
    // widget runs in its own iframe, so this script runs there too.
    if (document.getElementById('lim-panel')) return;
    if (window.top !== window.self) return;

    const panel = document.createElement('div');
    panel.id = 'lim-panel';
    panel.innerHTML = `
      <button id="lim-toggle" title="Insight Mode settings">◐</button>
      <div id="lim-body" hidden>
        <h3>Insight Mode</h3>
        <p class="lim-note">Pure visual filters — nothing is deleted or sent anywhere.
        Uncheck an item (or all of them) and reload for stock LinkedIn.</p>
        ${Object.keys(DEFAULTS).map(k => `
          <label><input type="checkbox" data-k="${k}" ${state[k] ? 'checked' : ''}> ${LABELS[k]}</label>
        `).join('')}
        <button id="lim-loadmore" type="button" style="margin-top:10px;width:100%;padding:8px;border:none;border-radius:6px;background:#0a66c2;color:#fff;font-size:13px;cursor:pointer;">Load more posts</button>
      </div>
    `;
    (document.body || document.documentElement).appendChild(panel);
    log('panel attached');

    panel.querySelector('#lim-toggle').addEventListener('click', guard('panel-toggle', () => {
      const body = panel.querySelector('#lim-body');
      body.hidden = !body.hidden;
    }));
    panel.querySelector('#lim-loadmore').addEventListener('click', guard('load-more-button', triggerManualLoad));
    panel.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', guard('checkbox-change', () => {
        state[cb.dataset.k] = cb.checked;
        save();
        applyClasses();
        document.querySelectorAll('[data-ins]').forEach(applyHideState);
        log('toggled', cb.dataset.k, '->', cb.checked);
      }));
    });
  }

  const safeScan = guard('scan', scan);
  safeScan(document.documentElement);
  new MutationObserver(guard('mutation-observer-callback', muts => {
    if (!document.getElementById('lim-style')) {
      (document.head || document.documentElement).appendChild(styleEl);
      warn('lim-style was missing from <head>, re-inserted');
    }
    // Each added node gets its own try/catch (via safeScan), not just the
    // whole callback -- one malformed node throwing shouldn't cause every
    // other node in the same mutation batch to go untagged.
    for (const m of muts) for (const n of m.addedNodes) safeScan(n);
  })).observe(document.documentElement, { childList: true, subtree: true });

  // Redundant with the buildPanel() call inside scan() above (idempotent,
  // guarded) -- this just covers the case where scan() ran once before
  // document.body existed and no further mutations happen to retrigger it.
  if (document.body) buildPanel();
  else document.addEventListener('DOMContentLoaded', buildPanel);

  // Experimental, not confirmed to help: grid.html showed a lazy-mount
  // wrapper LinkedIn never mounted content into at all, most likely because
  // its own "is this visible enough to render" check still assumes
  // single-column density and never re-evaluates once the grid changes
  // that. A resize event is one plausible trigger for that kind of
  // recalculation in a virtualized list -- cheap and harmless to try once,
  // but unverified whether LinkedIn's code actually listens for it.
  if (state.grid) {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 1200);
  }

  // Sanity check, not a feature: if these selectors ever stop matching
  // (LinkedIn renaming a data-testid/aria-label, the usual failure mode for
  // everything in this script), every dependent feature goes silently inert
  // with no visible sign anything's wrong. This makes that loud instead.
  setTimeout(() => {
    if (!document.getElementById('lim-panel')) err('panel never attached -- buildPanel() may be throwing, check above for stack traces');
    if (!document.querySelector('[data-testid="mainFeed"]')) warn('[data-testid="mainFeed"] not found -- grid/noAutoLoad/counts etc. have nothing to attach to');
    if (!document.getElementById('workspace')) warn('#workspace not found -- overflow-anchor fix is not applied to the real scroll container');
    if (!document.querySelector('[data-ins-postroot]')) warn('no posts tagged yet -- either none loaded, or the "Open control menu for post by" aria-label selector stopped matching');
    if (contractViolations.size) warn(contractViolations.size, 'contract violation(s) so far -- call __limStats() for the full list');
    log('sanity check complete,', stats.postsSeen, 'posts tagged so far');
  }, 5000);

  log('loaded, version', VERSION, 'config:', JSON.stringify(state));
})();
