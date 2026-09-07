"use client"

import { useQuery } from "@tanstack/react-query"
import { ArchiveIcon, MessageCircleIcon } from "lucide-react"
import { useMemo } from "react"
import type z from "zod"
import type { IssuesListResponseSchema } from "@/api/routes/list-issues"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { LikeButton } from "@/components/like-button"
import { Section } from "@/components/section"
import { getIssueInteractions } from "@/http/get-issue-interactions"

type Issues = z.infer<typeof IssuesListResponseSchema>

interface BoardContentProps {
  issues: Issues
}

type Interaction = { isLiked: boolean; likesCount: number }

const COLUMNS = [
  { key: "backlog", label: "Backlog" },
  { key: "todo", label: "To-do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
] as const satisfies ReadonlyArray<{ key: keyof Issues; label: string }>

export function BoardContent({ issues }: BoardContentProps) {
  const allIssuesIds = COLUMNS.flatMap((column) =>
    issues[column.key].map((issue) => issue.id),
  )

  const { data: interactionsData } = useQuery({
    queryKey: ["issue-likes", allIssuesIds.sort().join(",")],
    queryFn: () => getIssueInteractions({ issueIds: allIssuesIds }),
  })

  const interactions = useMemo(() => {
    if (!interactionsData) return new Map<string, Interaction>()

    return new Map<string, Interaction>(
      interactionsData.interactions.map((interaction) => [
        interaction.issueId,
        { isLiked: interaction.isLiked, likesCount: interaction.likesCount },
      ]),
    )
  }, [interactionsData])

  return (
    // No celular as quatro colunas viram uma faixa que rola de lado, cada uma
    // com largura de leitura. Espremidas na grade de quatro, o título de cada
    // card quebrava letra por letra.
    <main className="flex flex-1 min-h-0 gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-x-visible md:pb-0">
      {COLUMNS.map((column) => (
        <Column
          key={column.key}
          label={column.label}
          issues={issues[column.key]}
          interactions={interactions}
        />
      ))}
    </main>
  )
}

function Column({
  label,
  issues,
  interactions,
}: {
  label: string
  issues: Issues[keyof Issues]
  interactions: Map<string, Interaction>
}) {
  return (
    <Section.Root className="w-[78vw] shrink-0 md:w-auto">
      <Section.Header>
        <Section.Title>
          <ArchiveIcon className="size-3" />
          {label}
        </Section.Title>

        <Section.IssueCount>{issues.length}</Section.IssueCount>
      </Section.Header>

      <Section.Content>
        {!issues.length ? (
          <div className="flex items-center justify-center py-8 text-center">
            <p className="text-sm text-navy-300">
              No issues matching your filters
            </p>
          </div>
        ) : (
          issues.map((issue) => {
            const interaction = interactions.get(issue.id)

            return (
              <Card.Root href={`issues/${issue.id}`} key={issue.id}>
                <Card.Header>
                  <Card.Number>ISS-{issue.issueNumber}</Card.Number>
                  <Card.Title>{issue.title}</Card.Title>
                </Card.Header>

                <Card.Footer>
                  <LikeButton
                    issueId={issue.id}
                    initialLikes={interaction?.likesCount ?? 0}
                    initialLiked={interaction?.isLiked ?? false}
                  />

                  <Button>
                    <MessageCircleIcon className="size-3" />
                    <span className="text-xs">{issue.comments}</span>
                  </Button>
                </Card.Footer>
              </Card.Root>
            )
          })
        )}
      </Section.Content>
    </Section.Root>
  )
}
