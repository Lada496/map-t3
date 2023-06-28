import NextAuth from "next-auth";
import { authOptions } from "~/trpc/server/auth";

export default NextAuth(authOptions);
