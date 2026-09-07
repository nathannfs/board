import { Suspense } from "react"
import { UserButton } from "@/components/header/user-button"
import { SearchInput } from "./search-input"

export function Header() {
  return (
    <div className="max-w-225 mx-auto w-full flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="font-semibold text-xl">Product Roadmap</h1>
        <p className="text-sm text-navy-100">
          Follow the development progress of our entire platform.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Suspense>
          <SearchInput />
        </Suspense>
        <UserButton />
      </div>
    </div>
  )
}
