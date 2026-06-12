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
 *   FEIAuth.signInWithGoogle(redirectTo)    → Promise<void>   (redirects)
 *   FEIAuth.signOut()                       → Promise<void>
 *   FEIAuth.onAuthChange(callback)          → unsubscribe()
 *
 * Storage shape (Supabase user.user_metadata):
 *   { name: string }
 *
 * Companion business table: `smartclass_access` (see /core/access.js)
 * ─────────────────────────────────────────────────────────────────
 */
(function (global) {
  'use strict';

  // ⚠️ PLACEHOLDER — replace with values from Supabase dashboard → Settings → API
  // The anon/publishable key is SAFE in frontend code. Do NOT paste service_role key here.
  const SUPABASE_URL = 'https://rudztwseatwayhztbarj.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_NvPeY8sJYN8v4CoP1_X0BQ_RdluuoYT';

  const SUPABASE_JS_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';

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

  async function signInWithGoogle(redirectTo) {
    const c = await init();
    const { data, error } = await c.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || appBaseUrl(),
        skipBrowserRedirect: true,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
    if (error) throw error;
    if (data && data.url) {
      global.open(data.url, '_blank', 'noopener,noreferrer');
    }
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
    // Expose for diagnostics (do NOT include service_role; anon key is safe to read)
    _isConfigured: function () { return SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'PASTE_PUBLISHABLE_KEY_HERE'; }
  };
})(window);
