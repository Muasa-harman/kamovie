'use client'

import { QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import React, { useState } from "react";

const CACHE_BUSTER = "v1.0.0"; // bump this to clear old cache

// no-op persister for SSR
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
      : noopPersister; // ✅ safe fallback

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


// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactNode, useState } from "react";
// import {
//   persistQueryClient
// } from "@tanstack/react-query-persist-client";
// import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";


// export default function ReactQueryProvider({ children }: { children: ReactNode }) {
//   const [client] = useState(() => {
//     const queryClient = new QueryClient({
//       defaultOptions: {
//         queries: {
//           staleTime: 1000 * 60 * 10, // 10 minutes
//           gcTime: 1000 * 60 * 60, // 1 hour (replaces cacheTime in v5)
//         },
//       },
//     });

//     if (typeof window !== "undefined") {
//       const localStoragePersister = createWebStoragePersister({
//         storage: window.localStorage,
//       });

//       persistQueryClient({
//         queryClient,
//         persister: localStoragePersister,
//       });
//     }

//     return queryClient;
//   });

//   return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
// }
