// lib/offline/query-cache.ts
// Guarda en localStorage el último estado de las consultas de React Query
// para que /admin pueda mostrar datos recientes sin conexión.
import type { Persister, PersistedClient } from "@tanstack/react-query-persist-client";

export const OFFLINE_CACHE_KEY = "evolu:admin-offline-cache";
export const OFFLINE_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días
export const OFFLINE_CACHE_SAVED_EVENT = "evolu:offline-cache-saved";

const DATE_MARK = "__evoluDate";

type Json = unknown;

// Serializa fechas cuando se guarda el 'client' de React Query sin
// perder objetos Date, y elimina credenciales (hashes de contraseña).
function encode(value: Json): Json {
  if (value instanceof Date) {
    return { [DATE_MARK]: value.toISOString() };
  }

  if (Array.isArray(value)) {
    return value.map(encode);
  }

  if (value && typeof value === "object") {
    const result: Record<string, Json> = {};
    for (const [key, item] of Object.entries(value as Record<string, Json>)) {
      // Nunca persistir contraseñas (aunque vengan hasheadas).
      if (key === "password") continue;
      result[key] = encode(item);
    }
    return result;
  }

  return value;
}

function decode(value: Json): Json {
  if (Array.isArray(value)) {
    return value.map(decode);
  }

  if (value && typeof value === "object") {
    const marked = (value as Record<string, Json>)[DATE_MARK];
    if (typeof marked === "string") {
      return new Date(marked);
    }

    const result: Record<string, Json> = {};
    for (const [key, item] of Object.entries(value as Record<string, Json>)) {
      result[key] = decode(item);
    }
    return result;
  }

  return value;
}

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export const offlineCachePersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(
        OFFLINE_CACHE_KEY,
        JSON.stringify(encode({ savedAt: Date.now(), client }))
      );
      window.dispatchEvent(new Event(OFFLINE_CACHE_SAVED_EVENT));
    } catch (error) {
      // Almacenamiento lleno o bloqueado: no rompemos la app.
      console.warn("No se pudo guardar la caché offline:", error);
    }
  },

  restoreClient: async () => {
    if (!isBrowser()) return undefined;
    try {
      const raw = localStorage.getItem(OFFLINE_CACHE_KEY);
      if (!raw) return undefined;
      const parsed = decode(JSON.parse(raw)) as {
        client?: PersistedClient;
      };
      return parsed?.client;
    } catch (error) {
      console.warn("No se pudo leer la caché offline:", error);
      return undefined;
    }
  },

  removeClient: async () => {
    if (!isBrowser()) return;
    localStorage.removeItem(OFFLINE_CACHE_KEY);
  },
};

/** Momento (ms) en que se guardó la caché offline, o null si no hay. */
export function getOfflineCacheSavedAt(): number | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(OFFLINE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt?: number };
    return typeof parsed.savedAt === "number" ? parsed.savedAt : null;
  } catch {
    return null;
  }
}

export function clearOfflineCache() {
  if (!isBrowser()) return;
  localStorage.removeItem(OFFLINE_CACHE_KEY);
}
