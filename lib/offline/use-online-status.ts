// lib/offline/use-online-status.ts
"use client";

import { useEffect, useState } from "react";

/**
 * Rastrea si el navegador tiene conexión de red.
 * Nota: navigator.onLine puede decir 'online' aunque no haya acceso a internet
 * (por ejemplo, WiFi sin salida). Para la app es suficiente como primera capa:
 * React Query con networkMode 'online' es quien realmente detiene las peticiones
 * cuando el navegador está claramente offline.
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator === "undefined" ? true : navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
