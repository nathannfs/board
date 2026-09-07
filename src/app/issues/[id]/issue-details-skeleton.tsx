import { Skeleton } from "@/components/skeleton"
import { IssueCommentsSkeleton } from "./issue-comments/issue-comments-skeleton"

export function IssueDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-7 w-16" />
      </div>

      <Skeleton className="h-6 w-2/3" />

      <div className="space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>

      <IssueCommentsSkeleton />
    </div>
  )
}
