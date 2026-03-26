import Link from "next/link"
import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

type RootProps = ComponentProps<typeof Link>

function Root({ className, ...props }: RootProps) {
  return (
    <Link
      className={twMerge(
        "bg-navy-700 border-[0.5px] border-navy-600 p-3 space-y-4 rounded-lg block",
        "hover:bg-navy-600/50 hover:border-navy-500 transition-colors duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950",
        className,
      )}
      {...props}
    />
  )
}

type HeaderProps = ComponentProps<"div">

function Header({ className, ...props }: HeaderProps) {
  return (
    <div className={twMerge("flex flex-col gap-2", className)} {...props} />
  )
}

type TitleProps = ComponentProps<"span">

function Title({ className, ...props }: TitleProps) {
  return (
    <span className={twMerge("text-sm font-medium", className)} {...props} />
  )
}

type CardNumberProps = ComponentProps<"span">

function CardNumber({ className, ...props }: CardNumberProps) {
  return (
    <span className={twMerge("text-xs text-navy-200", className)} {...props} />
  )
}

type FooterProps = ComponentProps<"div">

function Footer({ className, ...props }: FooterProps) {
  return (
    <div className={twMerge("flex items-center gap-2", className)} {...props} />
  )
}

export const Card = {
  Root,
  Header,
  Title,
  Number: CardNumber,
  Footer,
}
