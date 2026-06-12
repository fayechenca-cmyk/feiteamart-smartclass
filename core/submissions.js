/**
 * FEI TeamArt · Student Submissions API (Round 44)
 * ═══════════════════════════════════════════════════════════════
 *
 * Standalone: loads Supabase JS SDK from CDN and reads the existing
 * session from localStorage (set by /core/auth.js on the home page).
 *
 * Lessons do NOT need to load core/auth.js. They just need to load
 * this file (and the user must have logged in on the home page first).
 *
 * USAGE in lesson HTML:
 *   <script src="../../core/submissions.js"></script>
 *
 *   const result = await window.FEISubmissions.submit({
 *     imageFile: file,
 *     lessonId: 'sphere',
 *     lessonTitle: 'The Sphere',
 *     courseId: 'foundation-a',
 *     reflectionText: '...'
 *   });
 */

(function () {
  'use strict';

  // ═══ CONFIG (must match /core/auth.js) ═══
  const SUPABASE_URL = 'https://rudztwseatwayhztbarj.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZHp0d3NlYXR3YXloenRiYXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NTQyOTYsImV4cCI6MjA4NjUzMDI5Nn0.YrPIS26glb-N5JIKspFuzdtp-t32qXAtLoDHwTbLVtk';
  // ⚠️ The anon key is PUBLIC by design (safe to embed in client code).
  //    The student's session is stored in localStorage and used by Supabase
  //    for row-level security on the server side.

  const STORAGE_BUCKET = 'student-artwork';
  const TABLE_NAME = 'student_submissions';

  let _client = null;
  let _ready = false;
  let _loadPromise = null;

  /**
   * Load the Supabase JS SDK from CDN and create a client.
   * Idempotent — safe to call many times.
   */
  function _loadClient() {
    if (_loadPromise) return _loadPromise;
    _loadPromise = new Promise((resolve, reject) => {
      if (window.supabase && window.supabase.createClient) {
        // SDK already loaded (e.g., by core/auth.js on home page)
        _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            storage: window.localStorage,
            storageKey: 'fei_supabase_auth',  // must match core/auth.js
            persistSession: true,
            autoRefreshToken: true
          }
        });
        _ready = true;
        resolve(_client);
        return;
      }
      // Load SDK from CDN
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      s.async = true;
      s.onload = () => {
        try {
          _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
              storage: window.localStorage,
              storageKey: 'fei_supabase_auth',
              persistSession: true,
              autoRefreshToken: true
            }
          });
          _ready = true;
          resolve(_client);
        } catch (e) {
          reject(e);
        }
      };
      s.onerror = () => reject(new Error('Failed to load Supabase SDK'));
      document.head.appendChild(s);
    });
    return _loadPromise;
  }

  // Kick off load immediately
  _loadClient().catch(err => {
    console.warn('[FEISubmissions] SDK load failed:', err);
  });

  /**
   * Generate a safe storage key.
   * Example: "abc123-user-id/sphere/1718294021_artwork.jpg"
   */
  function _makeStorageKey(userId, lessonId, fileName) {
    const ts = Date.now();
    const ext = (fileName && fileName.includes('.'))
      ? fileName.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      : 'jpg';
    return `${userId}/${lessonId}/${ts}_artwork.${ext}`;
  }

  /**
   * Get the current Supabase user from localStorage session.
   */
  async function _getCurrentUser() {
    try {
      await _loadClient();
      const { data, error } = await _client.auth.getUser();
      if (error || !data?.user) return null;
      return data.user;
    } catch (e) {
      return null;
    }
  }

  /**
   * Upload an image to Storage.
   */
  async function uploadImage(file, userId, lessonId) {
    if (!file) {
      return { ok: false, error: 'No file selected.' };
    }
    if (file.size > 10 * 1024 * 1024) {
      return { ok: false, error: 'File too large (max 10 MB).' };
    }
    if (!file.type.startsWith('image/')) {
      return { ok: false, error: 'Only image files are allowed.' };
    }

    await _loadClient();
    if (!_client) return { ok: false, error: 'Storage not available.' };

    const storageKey = _makeStorageKey(userId, lessonId, file.name);

    try {
      const { data, error } = await _client.storage
        .from(STORAGE_BUCKET)
        .upload(storageKey, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
      
      if (error) {
        console.error('[FEISubmissions] Upload failed:', error);
        return { ok: false, error: error.message || 'Upload failed' };
      }

      const { data: publicData } = _client.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(storageKey);
      
      return { ok: true, imageUrl: publicData?.publicUrl || '', storageKey };
    } catch (err) {
      console.error('[FEISubmissions] Upload threw:', err);
      return { ok: false, error: err.message || 'Network error' };
    }
  }

  /**
   * Create a submission record.
   */
  async function createRecord(params) {
    await _loadClient();
    if (!_client) return { ok: false, error: 'Database not available.' };

    try {
      const { data, error } = await _client
        .from(TABLE_NAME)
        .insert([{
          user_id: params.userId,
          user_email: params.userEmail,
          user_name: params.userName,
          course_id: params.courseId,
          lesson_id: params.lessonId,
          lesson_title: params.lessonTitle,
          image_url: params.imageUrl,
          reflection_text: params.reflectionText || null,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (error) {
        console.error('[FEISubmissions] Insert failed:', error);
        return { ok: false, error: error.message || 'Save failed' };
      }
      return { ok: true, submission: data };
    } catch (err) {
      console.error('[FEISubmissions] Insert threw:', err);
      return { ok: false, error: err.message || 'Network error' };
    }
  }

  /**
   * Main one-call submission function.
   */
  async function submit(params) {
    const user = await _getCurrentUser();
    if (!user) {
      return { ok: false, error: 'Please sign in to submit your work.' };
    }

    // Derive display name
    const name = user.user_metadata?.name 
      || user.user_metadata?.full_name 
      || (user.email ? user.email.split('@')[0] : 'Anonymous');

    // Step 1: Upload image
    const upload = await uploadImage(params.imageFile, user.id, params.lessonId);
    if (!upload.ok) return upload;

    // Step 2: Create database record
    const record = await createRecord({
      userId: user.id,
      userEmail: user.email,
      userName: name,
      courseId: params.courseId || 'foundation-a',
      lessonId: params.lessonId,
      lessonTitle: params.lessonTitle,
      imageUrl: upload.imageUrl,
      reflectionText: params.reflectionText || ''
    });

    return record;
  }

  /**
   * Get student's own submissions (used by /my-work/ in Round 45).
   */
  async function getMySubmissions() {
    await _loadClient();
    if (!_client) return { ok: false, error: 'Not available.', submissions: [] };
    try {
      const { data, error } = await _client
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return { ok: false, error: error.message, submissions: [] };
      return { ok: true, submissions: data || [] };
    } catch (err) {
      return { ok: false, error: err.message, submissions: [] };
    }
  }

  // Public API
  window.FEISubmissions = {
    submit: submit,
    uploadImage: uploadImage,
    createRecord: createRecord,
    getMySubmissions: getMySubmissions,
    _getClient: () => _client,
    _isReady: () => _ready
  };

  console.log('[FEISubmissions] Module initialized');
})();
