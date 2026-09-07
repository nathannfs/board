import { MoveLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { getIssue } from "@/http/get-issue"
import { IssueDetails } from "./issue-details"
import { IssueDetailsSkeleton } from "./issue-details-skeleton"

interface IssuePageProps {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({
  params,
}: IssuePageProps): Promise<Metadata> => {
  const { id } = await params

  const issue = await getIssue({ id })

  return {
    title: `Issue ${issue.title}`,
  }
}

export default function IssuePage({ params }: IssuePageProps) {
  return (
    <main className="max-w-225 mx-auto w-full flex flex-col gap-4 p-6 bg-navy-800 border-[0.5px] border-navy-500 rounded-xl">
      <Link
        href="/"
        className="flex items-center gap-2 text-navy-200 hover:text-navy-100"
      >
        <MoveLeftIcon className="size-4" />
        <span className="text-xs">Back to board</span>
      </Link>

      <Suspense fallback={<IssueDetailsSkeleton />}>
        <Details params={params} />
      </Suspense>
    </main>
  )
}

async function Details({ params }: IssuePageProps) {
  const { id } = await params

  return <IssueDetails issueId={id} />
}
