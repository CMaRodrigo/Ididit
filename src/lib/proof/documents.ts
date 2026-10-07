// Uploaded proof files live in IndexedDB — localStorage is too small for images and PDFs.
// Swap for real object storage when the backend lands; callers only see these three functions.
const DB = "proof.documents";
const STORE = "files";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

export const putFile = (id: string, file: Blob) => run<void>("readwrite", (s) => s.put(file, id));
export const getFile = (id: string) => run<Blob | undefined>("readonly", (s) => s.get(id));
export const deleteFile = (id: string) => run<void>("readwrite", (s) => s.delete(id));
