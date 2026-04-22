import { SessionRecord } from "@/lib/types";

const DATABASE_NAME = "typezy-db";
const DATABASE_VERSION = 1;
const SESSIONS_STORE = "sessions";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(SESSIONS_STORE)) {
        const sessions = database.createObjectStore(SESSIONS_STORE, { keyPath: "id" });
        sessions.createIndex("completedAt", "completedAt", { unique: false });
        sessions.createIndex("language", "language", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveSessionToIndexedDb(session: SessionRecord): Promise<void> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return;
  }

  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(SESSIONS_STORE, "readwrite");
    transaction.objectStore(SESSIONS_STORE).put(session);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function loadSessionsFromIndexedDb(): Promise<SessionRecord[]> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return [];
  }

  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(SESSIONS_STORE, "readonly");
    const request = transaction.objectStore(SESSIONS_STORE).getAll();
    request.onsuccess = () => {
      const sessions = (request.result as SessionRecord[]).sort((left, right) =>
        right.completedAt.localeCompare(left.completedAt)
      );
      resolve(sessions);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function loadSessionByIdFromIndexedDb(id: string): Promise<SessionRecord | undefined> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return undefined;
  }

  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(SESSIONS_STORE, "readonly");
    const request = transaction.objectStore(SESSIONS_STORE).get(id);
    request.onsuccess = () => resolve(request.result as SessionRecord | undefined);
    request.onerror = () => reject(request.error);
  });
}

export async function replaceSessionsInIndexedDb(sessions: SessionRecord[]): Promise<void> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return;
  }

  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(SESSIONS_STORE, "readwrite");
    const store = transaction.objectStore(SESSIONS_STORE);
    store.clear();
    sessions.forEach((session) => {
      store.put(session);
    });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
