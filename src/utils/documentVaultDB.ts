import { StoredDocument } from '../types';

const DB_NAME = 'AarambhDocumentVault_DB';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

let dbInstance: IDBDatabase | null = null;

export function openVaultDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('docType', 'docType', { unique: false });
        store.createIndex('capturedAt', 'capturedAt', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function getAllVaultDocuments(): Promise<StoredDocument[]> {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const result = (request.result || []) as StoredDocument[];
        // Sort newest first
        result.sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());
        resolve(result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('Falling back to local storage for documents:', err);
    try {
      const raw = localStorage.getItem('aarambh_doc_vault');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export async function saveVaultDocument(doc: StoredDocument): Promise<StoredDocument> {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(doc);

      request.onsuccess = () => {
        resolve(doc);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('Falling back to local storage save:', err);
    try {
      const docs = await getAllVaultDocuments();
      const existingIdx = docs.findIndex((d) => d.id === doc.id);
      if (existingIdx >= 0) {
        docs[existingIdx] = doc;
      } else {
        docs.unshift(doc);
      }
      localStorage.setItem('aarambh_doc_vault', JSON.stringify(docs));
      return doc;
    } catch (e) {
      throw new Error('Failed to save document to storage');
    }
  }
}

export async function deleteVaultDocument(id: string): Promise<boolean> {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('Falling back to local storage delete:', err);
    try {
      const docs = await getAllVaultDocuments();
      const filtered = docs.filter((d) => d.id !== id);
      localStorage.setItem('aarambh_doc_vault', JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }
}
