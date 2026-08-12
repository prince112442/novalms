"use client";
// components/providers/QueryProvider.tsx
// Wraps the app in a React Query client so dashboard widgets can useQuery()
// against the /api routes (same pattern the original vanilla JS used with
// plain fetch — this just adds caching, retries, and loading states).
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1 } }
      })
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
