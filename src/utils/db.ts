import { openDB } from 'idb';

export const dbPromise = openDB('api-client-db', 4, {
  upgrade(db, oldVersion, newVersion, transaction) {
    console.log(`DB upgrade from version ${oldVersion} to ${newVersion}`);
    
    if (!db.objectStoreNames.contains('history')) {
      db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('collections')) {
      db.createObjectStore('collections', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('globalHeaders')) {
      db.createObjectStore('globalHeaders', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('uiSettings')) {
      db.createObjectStore('uiSettings', { keyPath: 'id' });
    }
  },
});
