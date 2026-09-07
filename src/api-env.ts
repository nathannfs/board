import { z } from "zod"

const apiEnvSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  // Optional, so the app still boots with no OAuth application registered.
  // Without them the header offers the guest account instead of GitHub.
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  DEMO_MODE: z.stringbool().optional(),
  DEMO_PASSWORD: z.string().optional(),
})

export const apiEnv = apiEnvSchema.parse(process.env)
