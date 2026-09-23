/**
 * FEI TeamArt · Auth Module
 * Wraps Supabase Auth for email/password + Google OAuth.
 *
 * Public API (window.FEIAuth):
 *   FEIAuth.init()                          → Promise<void>   load Supabase SDK + create client
 *   FEIAuth.getUser()                       → Promise<User|null>
 *   FEIAuth.getSession()                    → Promise<Session|null>
 *   FEIAuth.signUpWithEmail(email, pw, name)→ Promise<{user, error}>
 *   FEIAuth.signInWithEmail(email, pw)      → Promise<{user, error}>
 *   FEIAuth.signInWithGoogle(redirectTo)    → Promise<void>   (redirects, or delegates to the parent — see below)
 *   FEIAuth.signOut()                       → Promise<void>
 *   FEIAuth.onAuthChange(callback)          → unsubscribe()
 *   FEIAuth.attachParentBridge(onUser, onError) → void   (embedded-mode Google return path — see below)
 *   FEIAuth.setSessionFromTokens(access, refresh) → Promise<User|null>
 *
 * Storage shape (Supabase user.user_metadata):
 *   { name: string }
 *
 * Companion business table: `smartclass_access` (see /core/access.js)
 *
 * ─────────────────────────────────────────────────────────────────
 * GOOGLE LOGIN INSIDE THE WEBFLOW IFRAME (Option A, Sept 2026)
 *
 * Smart Class is embedded in an iframe on a Webflow page
 * (https://www.feiteamart.com/guided-practice-studio — confirmed by Faye;
 * this is also the page Supabase's own Site URL already points to). This
 * app is on Supabase's
 * default IMPLICIT auth flow (confirmed by inspecting the actual loaded
 * SDK build, not assumed — GoTrueClient's hardcoded default is
 * flowType:'implicit', and nothing here overrides it), so a completed
 * Google login returns as a URL FRAGMENT (#access_token=...), which only
 * JS running on the exact page the browser lands on can ever read.
 *
 * The problem this section solves: signInWithOAuth's returned URL was
 * previously always opened with window.open(...,'_blank',...) — a brand
 * new tab, on THIS app's own github.io origin (skipBrowserRedirect:true
 * meant nothing navigated automatically). Google's callback then lands
 * that new tab on github.io, signed in there — while the original
 * Webflow tab/iframe never hears about it. Diagnosed, not guessed: see
 * the "Smart Class login diagnosis" report for the full evidence trail.
 *
 * THE FIX, when embedded (window.self !== window.top):
 *   1. START — instead of opening a popup, this file asks the PARENT
 *      (the Webflow page, via a small pasted snippet — see
 *      docs/webflow-auth-relay.html) to navigate ITSELF to Google, by
 *      posting {type:'fei:auth:start', url}. Asking the parent to
 *      navigate (rather than this iframe calling window.top.location
 *      directly) is deliberate: cross-origin top-level navigation from
 *      inside an iframe is subject to user-activation/sandboxing rules
 *      that vary by browser; a same-origin script on the parent's own
 *      page navigating itself has none of that uncertainty.
 *   2. FALLBACK — if the parent doesn't ack with {type:'fei:auth:started'}
 *      within ~1.5s (snippet not installed yet, stale cached Webflow
 *      page, etc.), this falls back to EXACTLY today's window.open
 *      behavior. The old path is not deleted — this makes the repo push
 *      and the Webflow paste safe to land in either order.
 *   3. RETURN — Google → Supabase → back to the Webflow URL (the
 *      snippet's job, not this file's). The Webflow page reloads,
 *      which also reloads the iframe (a fresh document, fresh JS state)
 *      pointed back at this same app.
 *   4. HAND-OFF — the fresh iframe calls attachParentBridge() early
 *      (see index.html's init()), which posts {type:'fei:iframe:ready'}
 *      once its listener is live. The snippet, which already parsed
 *      its own location.hash on load and immediately scrubbed it via
 *      history.replaceState (tokens must never sit in the address bar),
 *      sends {type:'fei:auth:session', access_token, refresh_token} (or
 *      {type:'fei:auth:error', message}) back — in whichever order the
 *      two events actually happen; the snippet handles both.
 *   5. RECEIVE — attachParentBridge's listener only accepts messages
 *      where event.origin is in WEBFLOW_ALLOWED_ORIGINS AND
 *      event.source === window.parent (never '*', on either side of
 *      this exchange). On a session message it calls
 *      c.auth.setSession(...) — the SAME iframe-local Supabase client
 *      and the SAME localStorage key (fei_supabase_auth) email/password
 *      already uses, so this introduces no new storage path — then
 *      resolves to a real user object, same shape getUser() already
 *      returns, so index.html's existing onAuthSuccess(user) runs
 *      unmodified.
 *
 * STANDALONE (opened directly on github.io, window.self === window.top)
 * is completely unchanged: signInWithGoogle() takes the exact same
 * window.open(...) path it always has, redirectTo defaults to
 * appBaseUrl() exactly as before.
 *
 * Access-code login (index.html's attemptSignIn), email/password login,
 * and core/access.js are untouched by this — Google is the only path
 * that ever routed through a popup/new-tab in the first place.
 * ─────────────────────────────────────────────────────────────────
 */
(function (global) {
  'use strict';

  // ⚠️ PLACEHOLDER — replace with values from Supabase dashboard → Settings → API
  // The anon/publishable key is SAFE in frontend code. Do NOT paste service_role key here.
  const SUPABASE_URL = 'https://rudztwseatwayhztbarj.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_NvPeY8sJYN8v4CoP1_X0BQ_RdluuoYT';

  const SUPABASE_JS_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';

  // Option A constants — ONE place, per the design. If the Webflow page
  // ever moves (new path, or the apex domain instead of www), update
  // WEBFLOW_APP_URL here; WEBFLOW_ALLOWED_ORIGINS is the postMessage
  // origin allowlist for the RETURN trip (kept slightly broader than
  // WEBFLOW_APP_URL's own origin on purpose, in case Faye's DNS/Webflow
  // setup serves the page on both www and the apex domain).
  const WEBFLOW_APP_URL = 'https://www.feiteamart.com/guided-practice-studio';
  const WEBFLOW_ALLOWED_ORIGINS = ['https://www.feiteamart.com', 'https://feiteamart.com'];
  const PARENT_START_TIMEOUT_MS = 1500;

  let _client = null;
  let _loadingPromise = null;
  let _authListeners = [];

  function loadSdk() {
    if (global.supabase && global.supabase.createClient) return Promise.resolve();
    if (_loadingPromise) return _loadingPromise;
    _loadingPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SUPABASE_JS_CDN;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load Supabase SDK'));
      document.head.appendChild(s);
    });
    return _loadingPromise;
  }

  async function init() {
    if (_client) return _client;
    await loadSdk();
    if (!global.supabase || !global.supabase.createClient) {
      throw new Error('Supabase SDK not available after load');
    }
    _client = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,   // pick up Google OAuth callback hash
        storage: global.localStorage,
        storageKey: 'fei_supabase_auth'
      }
    });

    // Wire global auth-state listener
    _client.auth.onAuthStateChange((event, session) => {
      _authListeners.forEach(cb => {
        try { cb(event, session); } catch (e) { console.warn('[FEIAuth] listener error', e); }
      });
    });

    return _client;
  }

  function getClient() {
    if (!_client) throw new Error('FEIAuth not initialized — call FEIAuth.init() first');
    return _client;
  }

  async function getUser() {
    const c = await init();
    const { data } = await c.auth.getUser();
    return data && data.user ? data.user : null;
  }

  async function getSession() {
    const c = await init();
    const { data } = await c.auth.getSession();
    return data && data.session ? data.session : null;
  }

  // Compute the app base URL — works correctly when hosted at the root domain
  // OR at a sub-path like https://user.github.io/feiteamart-smartclass/
  // and also future-proof for Cloudflare URL-masking back to feiteamart.com.
  function appBaseUrl() {
    const path = global.location.pathname;
    // Strip the trailing filename (e.g. /index.html) if present, leaving the directory
    const dir = path.replace(/[^\/]*$/, '');
    return global.location.origin + dir;
  }

  async function signUpWithEmail(email, password, name) {
    const c = await init();
    const { data, error } = await c.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { name: name || '' },
        // Email confirmation link will return the user to wherever this app is hosted.
        emailRedirectTo: appBaseUrl()
      }
    });
    return { user: data && data.user, session: data && data.session, error: error };
  }

  async function signInWithEmail(email, password) {
    const c = await init();
    const { data, error } = await c.auth.signInWithPassword({ email: email, password: password });
    return { user: data && data.user, session: data && data.session, error: error };
  }

  // window.self !== window.top never throws, even cross-origin — it's a
  // reference comparison, not a property read — so this needs no
  // try/catch to be safe. Kept defensive anyway to match this file's
  // existing style.
  function isEmbedded() {
    try { return global.self !== global.top; } catch (e) { return true; }
  }

  function webflowOrigin() {
    try { return new URL(WEBFLOW_APP_URL).origin; } catch (e) { return WEBFLOW_ALLOWED_ORIGINS[0]; }
  }

  // Asks the parent (Webflow) page to navigate itself to `url` instead of
  // this iframe opening a popup. Resolves true once the parent acks with
  // {type:'fei:auth:started'}; resolves false (never rejects) if it
  // doesn't answer within PARENT_START_TIMEOUT_MS or postMessage itself
  // throws — either way the caller falls back to the old window.open
  // path, so this never has to be relied on to be correct.
  function requestParentNavigate(url) {
    return new Promise(function (resolve) {
      let settled = false;
      function finish(result) {
        if (settled) return;
        settled = true;
        global.removeEventListener('message', onMessage);
        clearTimeout(timer);
        resolve(result);
      }
      function onMessage(event) {
        if (event.origin !== webflowOrigin()) return;
        if (event.source !== global.parent) return;
        const msg = event.data || {};
        if (msg.type === 'fei:auth:started') finish(true);
      }
      global.addEventListener('message', onMessage);
      try {
        global.parent.postMessage({ type: 'fei:auth:start', url: url }, webflowOrigin());
      } catch (e) {
        finish(false);
        return;
      }
      var timer = setTimeout(function () { finish(false); }, PARENT_START_TIMEOUT_MS);
    });
  }

  async function signInWithGoogle(redirectTo) {
    const c = await init();
    const embedded = isEmbedded();
    const { data, error } = await c.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || (embedded ? WEBFLOW_APP_URL : appBaseUrl()),
        skipBrowserRedirect: true,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
    if (error) throw error;
    if (!data || !data.url) return;

    if (!embedded) {
      // Standalone (opened directly on github.io) — unchanged.
      global.open(data.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Embedded: ask the Webflow parent to navigate itself. Falls back to
    // the exact same window.open behavior above if the parent doesn't
    // answer in time — see this file's header comment for the full flow.
    const startedByParent = await requestParentNavigate(data.url);
    if (!startedByParent) {
      global.open(data.url, '_blank', 'noopener,noreferrer');
    }
  }

  // Applies a session returned by the Webflow parent (see this file's
  // header comment) to THIS iframe's own Supabase client — same client,
  // same localStorage key (fei_supabase_auth) email/password already
  // uses. Never logs the tokens it's given.
  async function setSessionFromTokens(accessToken, refreshToken) {
    const c = await init();
    const { data, error } = await c.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    if (error) throw error;
    return data && data.user ? data.user : null;
  }

  // Sets up the embedded-mode RETURN listener and signals readiness to
  // the parent. Call once, early, on every page load (index.html's
  // init() does this before anything else) — a no-op in standalone mode.
  //   onUser(user)   — called with the signed-in user once setSession
  //                    succeeds from a {type:'fei:auth:session'} message.
  //   onError(msg)   — called with a short English string, either from
  //                    a {type:'fei:auth:error'} message or if setSession
  //                    itself fails.
  function attachParentBridge(onUser, onError) {
    if (!isEmbedded()) return;
    global.addEventListener('message', async function (event) {
      if (WEBFLOW_ALLOWED_ORIGINS.indexOf(event.origin) === -1) return;
      if (event.source !== global.parent) return;
      const msg = event.data || {};
      if (msg.type === 'fei:auth:session') {
        try {
          const user = await setSessionFromTokens(msg.access_token, msg.refresh_token);
          if (user && onUser) onUser(user);
          else if (onError) onError('Could not complete Google sign-in. Please try again.');
        } catch (e) {
          console.warn('[FEIAuth] setSession from parent-relayed tokens failed', e);
          if (onError) onError('Could not complete Google sign-in. Please try again.');
        }
      } else if (msg.type === 'fei:auth:error') {
        if (onError) onError(typeof msg.message === 'string' && msg.message ? msg.message : 'Google sign-in failed. Please try again.');
      }
    });
    try {
      global.parent.postMessage({ type: 'fei:iframe:ready' }, webflowOrigin());
    } catch (e) { /* standalone-only fallback already handled by the isEmbedded() guard above */ }
  }

  async function signOut() {
    const c = await init();
    await c.auth.signOut();
  }

  function onAuthChange(callback) {
    _authListeners.push(callback);
    return function unsubscribe() {
      _authListeners = _authListeners.filter(cb => cb !== callback);
    };
  }

  // Helper: derive a display name from a user object
  function displayName(user) {
    if (!user) return '';
    const md = user.user_metadata || {};
    if (md.name && String(md.name).trim()) return String(md.name).trim();
    if (md.full_name && String(md.full_name).trim()) return String(md.full_name).trim();
    if (user.email) return String(user.email).split('@')[0];
    return 'Friend';
  }

  global.FEIAuth = {
    init: init,
    getClient: getClient,
    getUser: getUser,
    getSession: getSession,
    signUpWithEmail: signUpWithEmail,
    signInWithEmail: signInWithEmail,
    signInWithGoogle: signInWithGoogle,
    signOut: signOut,
    onAuthChange: onAuthChange,
    displayName: displayName,
    SUPABASE_URL: SUPABASE_URL,
    // Option A (embedded Google login) additions — see this file's header comment.
    isEmbedded: isEmbedded,
    attachParentBridge: attachParentBridge,
    setSessionFromTokens: setSessionFromTokens,
    WEBFLOW_APP_URL: WEBFLOW_APP_URL,
    WEBFLOW_ALLOWED_ORIGINS: WEBFLOW_ALLOWED_ORIGINS,
    // Expose for diagnostics (do NOT include service_role; anon key is safe to read)
    _isConfigured: function () { return SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'PASTE_PUBLISHABLE_KEY_HERE'; }
  };
})(window);
