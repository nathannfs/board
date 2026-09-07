"use client"

import { SearchIcon } from "lucide-react"
import { debounce, useQueryState } from "nuqs"
import { parseAsString } from "nuqs/server"
import type { ChangeEvent } from "react"
import { Input } from "@/components/input"

export function SearchInput() {
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({
      shallow: false,
    }),
  )

  function handleSearchUpdate(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value, {
      limitUrlUpdates: event.target.value !== "" ? debounce(500) : undefined,
    })
  }

  return (
    <div className="relative flex-1 sm:flex-none">
      <SearchIcon className="absolute size-4 text-navy-200 left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />

      <Input
        type="text"
        placeholder="Search for features..."
        className="w-full pl-8 sm:w-67.5"
        value={search}
        onChange={handleSearchUpdate}
      />
    </div>
  )
}
