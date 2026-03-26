import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

type SkeletonProps = ComponentProps<"div">

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge("bg-navy-700 rounded-lg animate-pulse", className)}
      {...props}
    />
  )
}
