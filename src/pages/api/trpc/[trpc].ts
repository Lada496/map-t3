import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import { appRouter } from "~/trpc/server/api/routers";
import { createContextInner } from "~/trpc/server/api/context";
import { getServerSession } from "next-auth";

export default function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    async createContext() {
      const session = await getServerSession();
      return createContextInner({
        req,
        session,
      });
    },
    onError({ error }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error("Caught TRPC error:", error);
      }
      console.log({ error });
    },
  });
}
