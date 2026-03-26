import { DialogTitle } from "@radix-ui/react-dialog"
import { IssueDetails } from "@/app/issues/[id]/issue-details"
import { Modal } from "@/components/modal"
import { BackButton } from "./back-button"

interface IssueModalProps {
  params: Promise<{ id: string }>
}

export default async function IssueModal({ params }: IssueModalProps) {
  const { id } = await params

  return (
    <Modal>
      <div className="flex flex-col gap-4 p-6">
        <BackButton />

        <DialogTitle className="sr-only">Issue details</DialogTitle>

        <IssueDetails issueId={id} />
      </div>
    </Modal>
  )
}
