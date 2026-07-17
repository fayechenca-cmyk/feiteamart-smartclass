/* ============================================================
 * FEI TeamArt · Make My First Illustration Book — photo storage
 *
 * IndexedDB wrapper for storing compressed page photos. Used by
 * upload/, reader/, and portfolio/. localStorage is too small for
 * ~25 photos; IndexedDB stores Blobs directly.
 *
 * Compression: any uploaded image is redrawn on a <canvas> so its
 * longest edge is <=1200px, then re-encoded as JPEG at quality 0.85
 * (typically lands ~200-400KB per page).
 *
 * Caveat: Safari's ITP applies the same ~7-day inactive-storage
 * wipe to IndexedDB that it does to localStorage. No cloud sync
 * yet (that's a later batch) — uploaded photos live only on this
 * device/browser until then.
 * ============================================================ */
(function (global) {
  'use strict';

  const DB_NAME = 'fei_book_storage';
  const DB_VERSION = 1;
  const STORE_NAME = 'pages';
  const MAX_EDGE = 1200;
  const JPEG_QUALITY = 0.85;

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
          store.createIndex('bookId', 'bookId', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('Failed to open IndexedDB'));
    });
    return _dbPromise;
  }

  function makeKey(bookId, pageIndex) {
    return bookId + '::' + pageIndex;
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

  const BookStorage = {
    isSupported: isSupported,

    /** Compress and store a page photo. Returns the stored record. */
    async savePage(bookId, pageIndex, fileOrBlob) {
      const compressed = await compressImage(fileOrBlob);
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const record = {
          id: makeKey(bookId, pageIndex),
          bookId: bookId,
          pageIndex: pageIndex,
          blob: compressed,
          savedAt: Date.now()
        };
        const req = store.put(record);
        req.onsuccess = () => resolve(record);
        req.onerror = () => reject(req.error);
      });
    },

    /** Returns the stored record for one page, or null. */
    async getPage(bookId, pageIndex) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(makeKey(bookId, pageIndex));
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    },

    /** Returns all stored pages for a book, sorted by pageIndex ascending. */
    async listPages(bookId) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('bookId');
        const req = index.getAll(IDBKeyRange.only(bookId));
        req.onsuccess = () => {
          const rows = req.result || [];
          rows.sort((a, b) => a.pageIndex - b.pageIndex);
          resolve(rows);
        };
        req.onerror = () => reject(req.error);
      });
    },

    async deletePage(bookId, pageIndex) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(makeKey(bookId, pageIndex));
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    },

    /** Convenience: caller should URL.revokeObjectURL() when done with it. */
    blobToObjectURL(blob) {
      return URL.createObjectURL(blob);
    }
  };

  global.BookStorage = BookStorage;
})(window);
