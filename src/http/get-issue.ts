import { cacheLife } from "next/cache"
import { IssueSchema } from "@/api/routes/get-issue"
import { clientEnv } from "@/client-env"

interface GetIssueParams {
  id: string
}

export async function getIssue({ id }: GetIssueParams) {
  "use cache"

  cacheLife("minutes")

  const url = new URL(`/api/issues/${id}`, clientEnv.NEXT_PUBLIC_API_URL)

  const response = await fetch(url)
  const data = await response.json()

  return IssueSchema.parse(data)
}
