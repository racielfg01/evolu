// components/admin-view/OfflineIndicator.tsx
"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { WifiOff } from "lucide-react";
import {
  getOfflineCacheSavedAt,
  OFFLINE_CACHE_SAVED_EVENT,
} from "@/lib/offline/query-cache";
import { useOnlineStatus } from "@/lib/offline/use-online-status";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    // Defer el setState para evitar el error de React 19 ("cannot update a
    // component while rendering a different component") que ocurre cuando
    // el evento se dispara de forma síncrona desde el ciclo de guardado de
    // React Query durante un render.
    const refresh = () => {
      setTimeout(() => setSavedAt(getOfflineCacheSavedAt()), 0);
    };
    refresh();
    window.addEventListener(OFFLINE_CACHE_SAVED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(OFFLINE_CACHE_SAVED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (isOnline) return null;

  const savedLabel = savedAt
    ? `últimos datos guardados ${formatDistanceToNow(savedAt, {
        addSuffix: true,
        locale: es,
      })}`
    : "todavía no hay datos guardados en este dispositivo";

  return (
    <div
      role="status"
      className="flex items-center gap-2 border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900"
    >
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>
        Sin conexión · mostrando {savedLabel}. Las acciones de escritura no están
        disponibles.
      </span>
    </div>
  );
}
