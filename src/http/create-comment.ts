import "server-only"

import { updateTag } from "next/cache"
import { headers } from "next/headers"
import { CreateCommentSchema } from "@/api/routes/create-comment"
import { clientEnv } from "@/client-env"
import { getCookiesFromHeaders } from "./utils/get-cookies-from-headers"

interface CreateCommentParams {
  issueId: string
  text: string
}

export async function createComment({ issueId, text }: CreateCommentParams) {
  const url = new URL(
    `/api/issues/${issueId}/comments`,
    clientEnv.NEXT_PUBLIC_API_URL,
  )

  const incomingHeaders = await headers()

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: getCookiesFromHeaders(incomingHeaders),
  })
  const data = await response.json()

  updateTag(`issue-comments-${issueId}`)

  return CreateCommentSchema.parse(data)
}
