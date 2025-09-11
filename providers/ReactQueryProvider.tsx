'use client'

import { QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import React, { useState } from "react";

const CACHE_BUSTER = "v1.0.0"; 

const noopPersister = {
  persistClient: async () => {},
  restoreClient: async () => undefined,
  removeClient: async () => {},
};

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 10,
            gcTime: 1000 * 60 * 60,
          },
        },
      })
  );

  const persister =
    typeof window !== "undefined"
      ? createAsyncStoragePersister({
          storage: window.localStorage,
        })
      : noopPersister; 

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
        buster: CACHE_BUSTER,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
