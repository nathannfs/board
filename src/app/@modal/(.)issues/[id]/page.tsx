import { DialogTitle } from "@radix-ui/react-dialog"
import { Suspense } from "react"
import { IssueDetails } from "@/app/issues/[id]/issue-details"
import { IssueDetailsSkeleton } from "@/app/issues/[id]/issue-details-skeleton"
import { Modal } from "@/components/modal"
import { BackButton } from "./back-button"

interface IssueModalProps {
  params: Promise<{ id: string }>
}

// A promessa de `params` desce inteira em vez de ser aguardada aqui. Aguardar
// no corpo da página prende a casca do modal na mesma espera do dado, e com
// `cacheComponents` isso derruba o build inteiro.
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
