const DB_NAME = "zigzag-media-v1";
const STORE = "files";

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function run(mode, work) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const result = work(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(result?.result ?? result);
        tx.onerror = () => reject(tx.error);
      }),
  );
}

export function saveBlob(id, blob) {
  return run("readwrite", (store) => store.put(blob, id));
}

export function loadBlob(id) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const request = tx.objectStore(STORE).get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      }),
  );
}

export function removeBlob(id) {
  return run("readwrite", (store) => store.delete(id));
}

export function clearMedia() {
  return run("readwrite", (store) => store.clear());
}

export function kindOf(file) {
  const name = file.name.toLowerCase();
  if (file.type === "image/gif" || name.endsWith(".gif")) return "gif";
  if (file.type.startsWith("video/") || name.endsWith(".mp4") || name.endsWith(".webm")) return "video";
  if (name.endsWith(".fbx")) return "fbx";
  return "";
}
