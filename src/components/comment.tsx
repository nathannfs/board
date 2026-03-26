import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

type RootProps = ComponentProps<"div">

function Root({ className, ...props }: RootProps) {
  return (
    <div className={twMerge("flex items-start gap-2", className)} {...props} />
  )
}

type AvatarProps = ComponentProps<"img">

function Avatar({ className, ...props }: AvatarProps) {
  return (
    // biome-ignore lint/performance/noImgElement: Github image is already optimized
    <img
      className={twMerge("size-8 rounded-full", className)}
      alt=""
      {...props}
    />
  )
}

type HeaderProps = ComponentProps<"div">

function Header({ className, ...props }: HeaderProps) {
  return (
    <div
      className={twMerge("flex items-baseline gap-1", className)}
      {...props}
    />
  )
}

type ContentProps = ComponentProps<"div">

function Content({ className, ...props }: ContentProps) {
  return (
    <div
      className={twMerge(
        "flex-1 px-3 py-2.5 rounded-lg bg-navy-700 border[0.5px] border-navy-600 flex flex-col gap-1",
        className,
      )}
      {...props}
    />
  )
}

type AuthorProps = ComponentProps<"span">

function Author({ className, ...props }: AuthorProps) {
  return (
    <span className={twMerge("text-sm font-medium", className)} {...props} />
  )
}

type TimeProps = ComponentProps<"span">

function Time({ className, ...props }: TimeProps) {
  return (
    <span className={twMerge("text-xs text-navy-200", className)} {...props} />
  )
}

type TextProps = ComponentProps<"p">

function Text({ className, ...props }: TextProps) {
  return (
    <p
      className={twMerge("text-sm leading-relaxed text-navy-100", className)}
      {...props}
    />
  )
}

export const Comment = {
  Root,
  Avatar,
  Header,
  Content,
  Author,
  Time,
  Text,
}
