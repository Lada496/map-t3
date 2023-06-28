import { protectedProcedure, router } from "../trpc";

export const protectedRouter = router({
  message: protectedProcedure.query(() => {
    return "This message is fetched from a protected procedures.";
  }),
});
