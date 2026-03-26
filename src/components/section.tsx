import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

type RootProps = ComponentProps<"div">

function Root({ className, ...props }: RootProps) {
  return (
    <div
      className={twMerge(
        "bg-navy-800 rounded-xl border-[0.5px] border-navy-500 pt-3 flex flex-col gap-1 relative",
        className,
      )}
      {...props}
    />
  )
}

type HeaderProps = ComponentProps<"div">

function Header({ className, ...props }: HeaderProps) {
  return (
    <div
      className={twMerge("flex items-center justify-between px-3", className)}
      {...props}
    />
  )
}

type TitleProps = ComponentProps<"span">

function Title({ className, ...props }: TitleProps) {
  return (
    <span
      className={twMerge(
        "bg-navy-700 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs",
        className,
      )}
      {...props}
    />
  )
}

type IssueCountProps = ComponentProps<"span">

function IssueCount({ className, ...props }: IssueCountProps) {
  return (
    <span className={twMerge("text-xs text-navy-200", className)} {...props} />
  )
}

type ContentProps = ComponentProps<"div">

function Content({ className, ...props }: ContentProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-2.5 overflow-y-auto p-3 absolute inset-0 top-10 scrollbar scrollbar-thumb-navy-600 scrollbar-track-transparent",
        className,
      )}
      {...props}
    />
  )
}

export const Section = {
  Root,
  Header,
  Title,
  IssueCount,
  Content,
}
