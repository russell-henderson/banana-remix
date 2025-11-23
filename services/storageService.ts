
import { Post, User, Draft } from '../types';

const DB_NAME = 'BananaRemixDB';
const DB_VERSION = 1;
const STORES = {
  POSTS: 'posts',
  USERS: 'users',
  DRAFTS: 'drafts',
  SESSION: 'session' // To store currentUserId
};

// Helper to open DB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORES.POSTS)) db.createObjectStore(STORES.POSTS);
      if (!db.objectStoreNames.contains(STORES.USERS)) db.createObjectStore(STORES.USERS);
      if (!db.objectStoreNames.contains(STORES.DRAFTS)) db.createObjectStore(STORES.DRAFTS);
      if (!db.objectStoreNames.contains(STORES.SESSION)) db.createObjectStore(STORES.SESSION);
    };

    request.onsuccess = () => resolve(request.result);
  });
};

// Generic Save
const saveToStore = async (storeName: string, data: any) => {
  try {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    // We store the entire array as a single key 'all' for simplicity in this demo,
    // or key-value pairs. For React state syncing, storing the whole state blob is easiest.
    store.put(data, 'root'); 
    return tx.oncomplete;
  } catch (e) {
    console.error(`Error saving to ${storeName}`, e);
  }
};

// Generic Load
const loadFromStore = async (storeName: string): Promise<any> => {
  try {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get('root');
    
    return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
    });
  } catch (e) {
    console.error(`Error loading from ${storeName}`, e);
    return null;
  }
};

export const storageService = {
  savePosts: (posts: Post[]) => saveToStore(STORES.POSTS, posts),
  loadPosts: () => loadFromStore(STORES.POSTS),

  saveUsers: (users: Record<string, User>) => saveToStore(STORES.USERS, users),
  loadUsers: () => loadFromStore(STORES.USERS),

  saveDrafts: (drafts: Draft[]) => saveToStore(STORES.DRAFTS, drafts),
  loadDrafts: () => loadFromStore(STORES.DRAFTS),

  saveSession: (userId: string | null) => saveToStore(STORES.SESSION, userId),
  loadSession: () => loadFromStore(STORES.SESSION),

  clearAll: async () => {
    const db = await openDB();
    const stores = [STORES.POSTS, STORES.USERS, STORES.DRAFTS, STORES.SESSION];
    const tx = db.transaction(stores, 'readwrite');
    stores.forEach(storeName => tx.objectStore(storeName).clear());
    return new Promise<void>((resolve) => {
        tx.oncomplete = () => resolve();
    });
  }
};
