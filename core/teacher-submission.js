/**
 * FEI TeamArt · Shared "Submit to your teacher" upload component
 *
 * Single implementation for every Foundation A lesson's teacher-submission
 * flow: student picks a photo -> uploads to Supabase Storage
 * (student-artwork bucket) -> inserts a row into student_submissions ->
 * shows "sent, waiting for feedback". This used to be copy-pasted into
 * each of the 10 lesson-N/index.html files (and had drifted: some still
 * linked out to an old external site for live-class students instead of
 * actually submitting anywhere). Now there is exactly one copy of this
 * logic — edit this file once, every lesson picks it up.
 *
 * Exposed as plain globals (not a namespace object) because lesson pages
 * call these directly from inline onclick="..." HTML strings:
 *
 *   renderTeacherUploadModal()      -> string (modal HTML, drop into #upload-modal-content)
 *   onTeacherUploadFileSelected(e)  -> void   (file <input> onchange handler)
 *   sendTeacherUpload()             -> Promise<void>  ("Send to teacher" button onclick)
 *
 * Requires these globals already defined by the lesson page that loads
 * this script (every lesson-N/index.html defines all of them the same
 * way): UserProfile, LESSON, Analytics, showBubble, escapeHtml,
 * StudentRoster (optional), closeUploadModal().
 *
 * Writes to the same student_submissions table / student-artwork bucket
 * every course's access-code upload already used. course_id defaults to
 * 'foundation-a' (the only course family this is wired into so far) —
 * override by setting window.TEACHER_SUBMISSION_COURSE_ID before this
 * script loads, if a future course wants to reuse it.
 * ─────────────────────────────────────────────────────────────────
 */
(function (global) {
  'use strict';

  const UPLOAD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZHp0d3NlYXR3YXloenRiYXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NTQyOTYsImV4cCI6MjA4NjUzMDI5Nn0.YrPIS26glb-N5JIKspFuzdtp-t32qXAtLoDHwTbLVtk';
  const UPLOAD_URL = 'https://rudztwseatwayhztbarj.supabase.co';

  let _file = null;

  function _courseId() {
    return global.TEACHER_SUBMISSION_COURSE_ID || 'foundation-a';
  }

  function renderTeacherUploadModal() {
    return `
      <div class="modal-title">📋 Submit your artwork</div>
      <div class="modal-sub" style="margin-bottom: 20px;">
        Upload a photo of your artwork — it goes straight to your teacher.
      </div>

      <div class="upload-file-block">
        <label for="upload-file-input-teacher" class="upload-file-label" id="upload-file-label-teacher">
          <div class="upload-file-icon">📷</div>
          <div class="upload-file-text">
            <div class="upload-file-text-main">Upload your artwork</div>
            <div class="upload-file-text-sub">JPG or PNG · From your device</div>
          </div>
        </label>
        <input type="file"
               id="upload-file-input-teacher"
               accept="image/*"
               style="display:none"
               onchange="onTeacherUploadFileSelected(event)">
        <div class="upload-file-preview" id="upload-file-preview-teacher" style="display:none"></div>
      </div>

      <div id="teacher-upload-status" style="font-size: 12px; color: var(--ink-muted); margin: 10px 0; text-align: center;"></div>

      <button class="btn btn-gold" id="teacher-upload-send-btn"
              style="display:none; width: 100%; align-items: center; justify-content: center;
                     margin-bottom: 16px; font-size: 14px; padding: 16px 20px; border-radius: 30px;"
              onclick="sendTeacherUpload()">
        Send to teacher →
      </button>
      <div class="btn-stack" style="margin-top: 16px;">
        <button class="btn btn-ghost" onclick="closeUploadModal()">
          Cancel
        </button>
      </div>
    `;
  }

  function onTeacherUploadFileSelected(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (global.showBubble) global.showBubble('Please pick an image file (JPG or PNG)', 3000);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      if (global.showBubble) global.showBubble('Image is too large (max 10MB). Try a smaller photo.', 3500);
      return;
    }

    _file = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('upload-file-preview-teacher');
      const label = document.getElementById('upload-file-label-teacher');
      const esc = global.escapeHtml || ((s) => s);
      if (preview) {
        preview.innerHTML = `
          <img src="${e.target.result}" alt="Your drawing" class="upload-file-preview-img">
          <div class="upload-file-preview-meta">
            <span>✓ ${esc(file.name)}</span>
            <span class="upload-file-replace" onclick="document.getElementById('upload-file-input-teacher').click()">Replace</span>
          </div>
        `;
        preview.style.display = 'block';
      }
      if (label) label.style.display = 'none';
      const sendBtn = document.getElementById('teacher-upload-send-btn');
      if (sendBtn) sendBtn.style.display = 'flex';
    };
    reader.readAsDataURL(file);

    if (global.Analytics) {
      global.Analytics.track('upload_file_selected', { file_size: file.size, file_type: file.type });
    }
  }

  async function sendTeacherUpload() {
    if (!_file) return;

    const profile = global.UserProfile ? global.UserProfile.current() : null;
    if (!profile) {
      if (global.showBubble) global.showBubble('Could not identify your student account. Please sign in again.', 4000);
      return;
    }

    const statusEl = document.getElementById('teacher-upload-status');
    const sendBtn = document.getElementById('teacher-upload-send-btn');
    if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = 'Sending…'; }
    if (statusEl) statusEl.textContent = 'Uploading your artwork… ⏳';

    const file = _file;
    const fileName = Date.now() + '_' + Math.random().toString(36).slice(2) + '.jpg';

    // Storage upload — tracked independently of the DB insert below:
    // only show the error state if BOTH fail.
    let storageOk = false;
    let imageUrl = null;
    try {
      const uploadRes = await fetch(
        UPLOAD_URL + '/storage/v1/object/student-artwork/' + fileName,
        {
          method: 'POST',
          headers: {
            'apikey': UPLOAD_KEY,
            'Authorization': 'Bearer ' + UPLOAD_KEY,
            'Content-Type': file.type,
            'x-upsert': 'true'
          },
          body: file
        }
      );
      if (uploadRes.ok) {
        storageOk = true;
        imageUrl = UPLOAD_URL + '/storage/v1/object/public/student-artwork/' + fileName;
      } else {
        const errText = await uploadRes.text().catch(() => '');
        console.log('[TeacherUpload] storage upload failed:', uploadRes.status, errText);
      }
    } catch (storageErr) {
      console.log('[TeacherUpload] storage upload error:', storageErr);
    }

    // Identity: access-code students -> roster display name keyed by
    // student_code. Everyone else (live-class via Google/email, no
    // access code) -> profile.name, student_code stays null.
    const studentCode = profile.studentCode || null;
    const displayName = (studentCode && global.StudentRoster && global.StudentRoster.getDisplayName)
      ? (global.StudentRoster.getDisplayName(studentCode) || studentCode)
      : (profile.name || studentCode || null);

    const LESSON = global.LESSON || {};

    let insertOk = false;
    try {
      const insertRes = await fetch(UPLOAD_URL + '/rest/v1/student_submissions', {
        method: 'POST',
        headers: {
          apikey: UPLOAD_KEY,
          Authorization: 'Bearer ' + UPLOAD_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          student_code: studentCode,
          user_name: displayName,
          user_email: profile.email || null,
          course_id: _courseId(),
          lesson_id: LESSON.id || null,
          lesson_title: LESSON.title || LESSON.id || null,
          image_url: imageUrl,
          status: 'submitted'
        })
      });
      if (insertRes.ok) {
        insertOk = true;
      } else {
        const errText = await insertRes.text().catch(() => '');
        console.log('[TeacherUpload] database insert failed:', insertRes.status, errText);
      }
    } catch (insertErr) {
      console.log('[TeacherUpload] database insert error:', insertErr);
    }

    if (storageOk || insertOk) {
      if (statusEl) statusEl.textContent = "✓ Sent! Waiting for your teacher's feedback.";
      if (sendBtn) sendBtn.textContent = 'Sent ✓';
      if (global.Analytics) {
        global.Analytics.track('submission_teacher_upload_success', {
          lesson_id: LESSON.id, storage_ok: storageOk, insert_ok: insertOk
        });
      }
      _file = null;
      setTimeout(() => {
        if (typeof global.closeUploadModal === 'function') global.closeUploadModal();
      }, 2000);
    } else {
      console.log('[TeacherUpload] failed — both storage upload and database insert failed');
      if (statusEl) statusEl.textContent = "⚠️ Couldn't send — please try again.";
      if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = 'Send to teacher →'; }
      if (global.Analytics) {
        global.Analytics.track('submission_teacher_upload_failed', { lesson_id: LESSON.id });
      }
    }
  }

  global.renderTeacherUploadModal = renderTeacherUploadModal;
  global.onTeacherUploadFileSelected = onTeacherUploadFileSelected;
  global.sendTeacherUpload = sendTeacherUpload;
})(window);
