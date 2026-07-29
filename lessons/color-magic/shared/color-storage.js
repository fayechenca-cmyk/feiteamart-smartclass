/* ============================================================
 * FEI TeamArt · Color Magic — finished-artwork photo storage
 *
 * IndexedDB wrapper for the Gallery step (step-10). Modeled directly on
 * lessons/first-illustration-book/shared/book-storage.js — same
 * compress-on-canvas approach, same Blob-in-IndexedDB shape — but scoped
 * to its own DB name/store so it never collides with any other course.
 *
 * Compression: any uploaded image is redrawn on a <canvas> so its
 * longest edge is <=1400px, then re-encoded as JPEG at quality 0.87.
 *
 * Caveat: Safari's ITP applies the same ~7-day inactive-storage wipe to
 * IndexedDB that it does to localStorage. No cloud sync yet — uploaded
 * photos live only on this device/browser until then.
 * ============================================================ */
(function (global) {
  'use strict';

  const DB_NAME = 'fei_color_magic_storage';
  const DB_VERSION = 1;
  const STORE_NAME = 'artworks';
  const MAX_EDGE = 1400;
  const JPEG_QUALITY = 0.87;

  let _dbPromise = null;

  function isSupported() {
    return !!global.indexedDB;
  }

  function openDB() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise((resolve, reject) => {
      if (!isSupported()) {
        reject(new Error('IndexedDB is not available in this browser'));
        return;
      }
      let req;
      try {
        req = global.indexedDB.open(DB_NAME, DB_VERSION);
      } catch (e) {
        reject(e);
        return;
      }
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('pieceId', 'pieceId', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('Failed to open IndexedDB'));
    });
    return _dbPromise;
  }

  // Resize/re-encode an uploaded File/Blob via canvas.
  function compressImage(fileOrBlob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(fileOrBlob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        const longestEdge = Math.max(width, height);
        if (longestEdge > MAX_EDGE) {
          const scale = MAX_EDGE / longestEdge;
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Image compression failed'));
        }, 'image/jpeg', JPEG_QUALITY);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not load the selected image'));
      };
      img.src = url;
    });
  }

  const ColorStorage = {
    isSupported: isSupported,

    /** Compress and store a finished-artwork photo. Returns the record. */
    async saveArtwork(pieceId, fileOrBlob) {
      const compressed = await compressImage(fileOrBlob);
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const record = {
          id: pieceId + '::' + Date.now(),
          pieceId: pieceId,
          blob: compressed,
          savedAt: Date.now()
        };
        const req = store.put(record);
        req.onsuccess = () => resolve(record);
        req.onerror = () => reject(req.error);
      });
    },

    /** All saved artworks for this piece, newest first. */
    async listArtworks(pieceId) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('pieceId');
        const req = index.getAll(IDBKeyRange.only(pieceId));
        req.onsuccess = () => {
          const rows = req.result || [];
          rows.sort((a, b) => b.savedAt - a.savedAt);
          resolve(rows);
        };
        req.onerror = () => reject(req.error);
      });
    },

    async deleteArtwork(id) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    },

    /** Convenience: caller should URL.revokeObjectURL() when done with it. */
    blobToObjectURL(blob) {
      return URL.createObjectURL(blob);
    }
  };

  global.ColorStorage = ColorStorage;
})(window);
