import { createAuthClient } from "better-auth/react"
import { clientEnv } from "@/client-env"

export const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_API_URL,
})
