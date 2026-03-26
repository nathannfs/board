import { ImageResponse } from "next/og"
import { getIssue } from "@/http/get-issue"

interface IssueImageProps {
  params: Promise<{ id: string }>
}

export default async function IssueImage({ params }: IssueImageProps) {
  const { id } = await params

  const issue = await getIssue({ id })

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        background: "#16161d",
        padding: "80px",
      }}
    >
      <p style={{ fontSize: 40, fontWeight: 600, color: "#9397aa" }}>
        {issue.title}
      </p>
      <p
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: "#ecedf2",
          textAlign: "left",
          maxWidth: 1000,
        }}
      >
        {issue.description}
      </p>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
