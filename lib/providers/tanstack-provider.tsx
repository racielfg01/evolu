// lib/providers/tanstack-provider.tsx
"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import {
  OFFLINE_CACHE_MAX_AGE,
  offlineCachePersister,
} from "@/lib/offline/query-cache";

const SEVEN_DAYS = OFFLINE_CACHE_MAX_AGE;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        // La caché debe sobrevivir lo suficiente para usarse sin conexión.
        gcTime: SEVEN_DAYS,
        // Sin conexión no lanzamos peticiones: se muestra lo último guardado.
        networkMode: "online",
      },
      mutations: {
        // Las escrituras deben fallar rápido (con aviso) en vez de quedar
        // en cola y ejecutarse solas al recuperar la conexión.
        networkMode: "always",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export default function TanstackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  if (isServer) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: offlineCachePersister,
        maxAge: OFFLINE_CACHE_MAX_AGE,
        buster: "admin-offline-v1",
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
