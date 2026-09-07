import { z } from "zod"

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().optional().default("http://localhost:3000"),
})

// Every variable is named one by one instead of `parse(process.env)`. In the
// browser Next substitutes `process.env.NEXT_PUBLIC_X` at build time, but only
// where the key is written out in the code. Hand it the whole object and the
// client receives `{}`, falls back to the default, and calls whatever address
// the machine that built it was using.
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})
