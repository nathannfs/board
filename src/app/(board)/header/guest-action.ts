"use server"

import { headers } from "next/headers"
import { auth } from "@/api/auth"
import { apiEnv } from "@/api-env"

const GUEST_EMAIL = "guest@nathannfs.com"

/**
 * Signs a visitor in without an account.
 *
 * Signing in with GitHub needs an OAuth application tied to a domain, which a
 * deployment meant for people to try does not always have. This opens a shared
 * guest account instead. The password never reaches the browser: it lives in
 * the environment and is spent here, on the server.
 */
export async function signInAsGuest() {
  if (!apiEnv.DEMO_MODE) throw new Error("guest sign-in is off")

  await auth.api.signInEmail({
    body: { email: GUEST_EMAIL, password: apiEnv.DEMO_PASSWORD ?? "" },
    headers: await headers(),
  })
}
