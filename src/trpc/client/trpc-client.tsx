"use client";

import type { AppRouter } from "../server/api/routers";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { transformer } from "../server/api/transformer";
import { createHydrateClient } from "./createHydrateClient";
import { createTRPCNextBeta } from "./createTrpcNextBeta";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url

  // if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  // return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
  return "http://localhost:3000";
};

/*
 * Create a client that can be used in the client only
 */

export const trpcClient = createTRPCNextBeta<AppRouter>({
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        cacheTime: Infinity,
        staleTime: Infinity,
      },
    },
  },
  links: [
    loggerLink({
      enabled: () => true,
    }),
    httpBatchLink({
      // url: `${getBaseUrl()}/api/trpc`,
      url: `http://localhost:3000/api/trpc`,
    }),
  ],
  transformer,
});

/*
 * A component used to hydrate the state from server to client
 */
export const HydrateClient = createHydrateClient({
  transformer,
});
