import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { getServerAuthSession } from "../auth";
import { prisma } from "../db";
import type { NextRequest } from "next/server";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = {
  session: Session | null;
  req: NextRequest | GetServerSidePropsContext["req"] | null;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    req: opts.req,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createContextInner({
    session,
    req: opts.req,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
