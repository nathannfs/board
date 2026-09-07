import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { apiEnv } from "@/api-env"
import { db } from "./db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  secret: apiEnv.BETTER_AUTH_SECRET,
  baseURL: apiEnv.BETTER_AUTH_URL,
  // The guest account signs in with a password, and nobody registers: the two
  // credentials are fixed and live in the environment.
  emailAndPassword: { enabled: true, disableSignUp: true },
  socialProviders:
    apiEnv.GITHUB_CLIENT_ID && apiEnv.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: apiEnv.GITHUB_CLIENT_ID,
            clientSecret: apiEnv.GITHUB_CLIENT_SECRET,
          },
        }
      : {},
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [nextCookies()],
})

export type AuthSession = typeof auth.$Infer.Session
