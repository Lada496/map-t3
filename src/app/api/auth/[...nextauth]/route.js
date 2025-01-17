// Super gross
// eslint-disable-next-line
// @ts-nocheck
import { cookies } from "next/headers";
import NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

async function auth(req, res) {
  // Get user's preference from cookie
  const cookieStore = cookies();
  const rememberMe = cookieStore.get("remember-me");

  // Get user's preference from form
  const urlString = req.url;
  const url = new URL(urlString);
  const params = new URLSearchParams(url.search);
  const rememberPassword = params.get("rememberPassword");

  if (rememberMe && authOptions.session) {
    authOptions.session.maxAge =
      rememberMe.value === "true" ? 30 * 24 * 60 * 60 : 15 * 60;
  }
  if (rememberPassword && authOptions.session) {
    authOptions.session.maxAge =
      rememberPassword === "true" ? 30 * 24 * 60 * 60 : 15 * 60;
    cookieStore.set("remember-me", rememberPassword, {
      path: "/",
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await NextAuth(req, res, authOptions);
}

export { auth as GET, auth as POST };
