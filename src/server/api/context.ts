/* eslint-disable @typescript-eslint/no-unused-vars */
import type * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";
import { getServerSession, type Session } from "next-auth";
import type { getUser, User } from "~/server-rsc/getUser";
import { authOptions } from "~/server/auth";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
  user: User | null;
  rsc: boolean;
  session: Session;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export function createContextInner(opts: CreateContextOptions) {
  return {
    user: opts.user,
    session: opts.session,
  };
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: // HACKs because we can't import `next/cookies` in `/api`-routes
  | {
        type: "rsc";
        getUser: typeof getUser;
      }
    | (trpcNext.CreateNextContextOptions & { type: "api" })
) {
  // for API-response caching see https://trpc.io/docs/caching

  if (opts.type === "rsc") {
    // RSC
    return {
      type: opts.type,
      user: await opts.getUser(),
    };
  }
  // not RSC
  const session = await getServerSession(opts.req, opts.res, authOptions);
  return {
    type: opts.type,
    user: session?.user,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
