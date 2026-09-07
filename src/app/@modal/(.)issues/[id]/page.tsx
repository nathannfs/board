import { DialogTitle } from "@radix-ui/react-dialog"
import { Suspense } from "react"
import { IssueDetails } from "@/app/issues/[id]/issue-details"
import { IssueDetailsSkeleton } from "@/app/issues/[id]/issue-details-skeleton"
import { Modal } from "@/components/modal"
import { BackButton } from "./back-button"

interface IssueModalProps {
  params: Promise<{ id: string }>
}

// The `params` promise is passed down whole instead of awaited here. Awaiting
// it in the page body pins the modal shell to the same wait as the data, and
// with `cacheComponents` that fails the build.
export default function IssueModal({ params }: IssueModalProps) {
  return (
    <Modal>
      <div className="flex flex-col gap-4 p-6">
        <BackButton />

        <DialogTitle className="sr-only">Issue details</DialogTitle>

        <Suspense fallback={<IssueDetailsSkeleton />}>
          <Details params={params} />
        </Suspense>
      </div>
    </Modal>
  )
}

async function Details({ params }: IssueModalProps) {
  const { id } = await params

  return <IssueDetails issueId={id} />
}
