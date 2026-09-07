# GitHub Copilot Instructions

These instructions define **how to create** pages, components, and features in this Next.js project. Follow every rule described here when generating or suggesting code.

---

## Stack

- **Next.js 16+ with App Router** — never use Pages Router patterns
- **TypeScript** — strict mode, no `any`
- **Tailwind CSS v4** — class merging via `tailwind-merge`
- **React Query v5** — all client-side async state
- **Zod v4** — all validation and type inference
- **Hono + @hono/zod-openapi** — API layer
- **Drizzle ORM** — database queries
- **Biome** — linter and formatter (`pnpm lint`, `pnpm format`)
- **nuqs** — URL search params state
- **lucide-react** — icons
- **date-fns** — date formatting

---

## How to Decide: Server Component or Client Component?

This is the most important decision. Always start with Server Component and only convert when needed.

### Use a Server Component when:
- Fetching data (database, API, file system)
- Rendering static or SEO content
- No user interaction needed (no clicks, no local state)
- The component does not use hooks

```tsx
// ✅ Server Component — no "use client", async, fetches data
export default async function ProductsPage() {
  const products = await fetchProducts() // direct fetch or DB call
  return <ProductList products={products} />
}
```

### Use a Client Component when:
- Handling user events (`onClick`, `onChange`, `onSubmit`)
- Using React hooks (`useState`, `useEffect`, `useQuery`, `useMutation`)
- Using browser APIs (`localStorage`, `window`)
- Using `useRouter`, `usePathname`, `useSearchParams`

```tsx
// ✅ Client Component — "use client" required
"use client"

import { useState } from "react"

export function SearchInput() {
  const [value, setValue] = useState("")
  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}
```

### The Golden Rule: Push "use client" to the leaves

Keep the tree as Server Components as long as possible. Extract only the interactive part into a Client Component.

```
Page (Server) ──► Layout (Server) ──► Content (Server) ──► LikeButton (Client ✅)
                                                   └──► CommentList (Server)
```

```tsx
// ✅ Page stays as Server Component
export default async function IssuesPage() {
  const issues = await listIssues()
  return (
    <main>
      <IssueList issues={issues} /> {/* Server component */}
    </main>
  )
}

// ✅ Only the interactive button is a Client Component
"use client"
export function LikeButton({ issueId }: { issueId: string }) {
  const { mutate } = useMutation({ mutationFn: () => toggleLike({ issueId }) })
  return <button onClick={() => mutate()}>Like</button>
}
```

---

## How to Create a Page

### Step 1 — Create the file

Pages live in `src/app/`. Route groups `(name)` organize routes without affecting the URL.

```
src/app/
├── (board)/            → URL: /
│   └── page.tsx
├── issues/
│   └── [id]/
│       └── page.tsx   → URL: /issues/123
└── settings/
    └── page.tsx        → URL: /settings
```

### Step 2 — Page is always a Server Component by default

```tsx
// src/app/issues/page.tsx
import type { Metadata } from "next"

// Always export metadata or generateMetadata
export const metadata: Metadata = {
  title: "Issues",
  description: "Browse all project issues.",
}

// searchParams must be typed as Promise in Next.js 16+
interface PageProps {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default async function IssuesPage({ searchParams }: PageProps) {
  const { q, status } = await searchParams

  // Fetch data here — never in client components
  const issues = await listIssues({ search: q, status })

  // Pass data down to client components as props
  return <IssuesContent issues={issues} />
}
```

### Step 3 — Create the Client Component for interactivity

```tsx
// src/app/issues/issues-content.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import type z from "zod"
import type { IssuesListSchema } from "@/http/list-issues"

interface IssuesContentProps {
  issues: z.infer<typeof IssuesListSchema>
}

export function IssuesContent({ issues }: IssuesContentProps) {
  // Use React Query only for client-side data that changes without navigation
  const { data } = useQuery({
    queryKey: ["issue-interactions"],
    queryFn: () => getIssueInteractions(),
  })

  return (
    <main>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </main>
  )
}
```

### Step 4 — Add loading and layout files when needed

```tsx
// src/app/issues/loading.tsx — shown during Server Component fetch
import { Skeleton } from "@/components/skeleton"

export default function IssuesLoading() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}
```

```tsx
// src/app/issues/layout.tsx — shared wrapper for all /issues/* routes
export default function IssuesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <IssuesHeader />
      {children}
    </div>
  )
}
```

---

## How to Create a Component

### Step 1 — Always use the Compound Component pattern for shared UI

Each component exports a namespace object with sub-components. This avoids prop-drilling and keeps usage declarative.

```tsx
// src/components/card.tsx
import Link from "next/link"
import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

// Type props by extending native element or component props
type RootProps = ComponentProps<typeof Link>

function Root({ className, ...props }: RootProps) {
  return (
    <Link
      className={twMerge(
        "bg-navy-700 border-[0.5px] border-navy-600 p-3 rounded-lg block",
        "hover:bg-navy-600/50 transition-colors duration-150",
        // Always add focus-visible for accessibility
        "outline-none focus-visible:ring-2 focus-visible:ring-navy-400",
        className, // always allow className override at the end
      )}
      {...props} // always spread remaining props
    />
  )
}

function Header({ className, ...props }: ComponentProps<"div">) {
  return <div className={twMerge("flex flex-col gap-2", className)} {...props} />
}

function Title({ className, ...props }: ComponentProps<"span">) {
  return <span className={twMerge("text-sm font-medium", className)} {...props} />
}

function Footer({ className, ...props }: ComponentProps<"div">) {
  return <div className={twMerge("flex items-center gap-2", className)} {...props} />
}

// Export as a single namespace
export const Card = { Root, Header, Title, Footer }
```

**Usage:**

```tsx
<Card.Root href={`/issues/${issue.id}`}>
  <Card.Header>
    <Card.Title>{issue.title}</Card.Title>
  </Card.Header>
  <Card.Footer>
    <LikeButton issueId={issue.id} />
  </Card.Footer>
</Card.Root>
```

### Step 2 — Rules for component props

```tsx
// ✅ Always extend native element props — gives full HTML attribute support
type ButtonProps = ComponentProps<"button">

function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge("px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5", className)}
      {...props}
    >
      {children}
    </button>
  )
}

// ✅ Add specific props via interface extending
interface LikeButtonProps extends ComponentProps<"button"> {
  issueId: string
  initialLikes: number
  initialLiked?: boolean
}
```

### Step 3 — Client Components with mutations (e.g., buttons that call APIs)

```tsx
// src/components/like-button.tsx
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ThumbsUpIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { toggleLike } from "@/http/toggle-like"

interface LikeButtonProps extends ComponentProps<"button"> {
  issueId: string
  initialLikes: number
  initialLiked?: boolean
}

export function LikeButton({
  issueId,
  initialLikes,
  initialLiked = false,
  ...props
}: LikeButtonProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => toggleLike({ issueId }),

    // Optimistic update: update UI before server responds
    onMutate: async () => {
      const previousData = queryClient.getQueriesData({ queryKey: ["issue-likes"] })
      queryClient.setQueriesData({ queryKey: ["issue-likes"] }, (old: any) => {
        // update local cache...
      })
      return { previousData }
    },

    // Rollback if server returns an error
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        for (const [key, data] of context.previousData) {
          queryClient.setQueryData(key, data)
        }
      }
    },
  })

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    // Always stop propagation when button is inside a clickable Link
    event.preventDefault()
    event.stopPropagation()
    mutate()
  }

  return (
    <button
      // Use data attributes for state-based styling — avoids conditional class logic
      data-liked={initialLiked}
      className="data-[liked=true]:bg-indigo-600 data-[liked=true]:text-white"
      aria-label={initialLiked ? "Unlike" : "Like"} // required for icon-only buttons
      disabled={isPending}
      onClick={handleClick}
      {...props}
    >
      <ThumbsUpIcon className="size-3" />
      <span className="text-xs">{initialLikes}</span>
    </button>
  )
}
```

---

## How to Fetch Data

### From a Server Component (preferred)

```tsx
// Fetch directly in the page or layout — no hooks needed
export default async function Page() {
  const data = await myFetchFunction() // defined in src/http/
  return <MyClientComponent data={data} />
}
```

### From the HTTP layer (`src/http/`)

Every fetch must go through a named function in `src/http/`. Never write `fetch()` inside a component.

```ts
// src/http/list-products.ts
import { ProductsListSchema } from "@/api/routes/list-products" // import schema from API
import { clientEnv } from "@/client-env"

interface Params {
  category?: string
}

export async function listProducts({ category }: Params = {}) {
  // Always build URLs with new URL()
  const url = new URL("/api/products", clientEnv.NEXT_PUBLIC_API_URL)
  if (category) url.searchParams.set("category", category)

  const response = await fetch(url)
  const data = await response.json()

  // Always parse with Zod — never return response.json() directly
  return ProductsListSchema.parse(data)
}
```

### With server-side cache

```ts
// src/http/list-issues.ts
import { cacheLife } from "next/cache"

export async function listIssues() {
  "use cache"        // Next.js native cache
  cacheLife("minutes") // cache duration: "seconds" | "minutes" | "hours" | "days"

  const url = new URL("/api/issues", clientEnv.NEXT_PUBLIC_API_URL)
  const response = await fetch(url)
  return IssuesListSchema.parse(await response.json())
}
```

### For server-only mutations (called from Server Actions or Route Handlers)

```ts
// src/http/create-product.ts
import "server-only" // prevents accidental client-side usage
import { headers } from "next/headers"
import { updateTag } from "next/cache"
import { getCookiesFromHeaders } from "./utils/get-cookies-from-headers"

export async function createProduct(input: CreateProductInput) {
  const url = new URL("/api/products", clientEnv.NEXT_PUBLIC_API_URL)
  const incomingHeaders = await headers()

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(input),
    headers: getCookiesFromHeaders(incomingHeaders), // forward auth cookies
  })

  const data = await response.json()
  updateTag("products") // invalidate cache
  return CreateProductSchema.parse(data)
}
```

### From a Client Component (React Query)

```tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { getProductDetails } from "@/http/get-product-details"

export function ProductDetails({ productId }: { productId: string }) {
  const { data, isLoading } = useQuery({
    // queryKey must be stable and descriptive
    queryKey: ["product", productId],
    queryFn: () => getProductDetails({ productId }),
    enabled: !!productId, // only run if productId exists
  })

  if (isLoading) return <Skeleton className="h-32 w-full" />
  return <div>{data?.name}</div>
}
```

---

## How to Add URL Filters / Search (nuqs)

Use `nuqs` to sync state with the URL. Never use `useState` for filters.

```tsx
"use client"

import { useQueryState, parseAsString, parseAsInteger } from "nuqs"

export function IssueFilters() {
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""))
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  return (
    <div>
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value || null) // null removes the param from the URL
          setPage(1) // reset page on search change
        }}
        placeholder="Search..."
      />
    </div>
  )
}
```

`NuqsAdapter` is already set up in the root layout — no additional setup needed.

---

## How to Use Icons

Always use `lucide-react`. Control size via `className`, not props:

```tsx
import { PlusIcon, TrashIcon, CheckCircleIcon } from "lucide-react"

// ✅ Correct
<PlusIcon className="size-4" />
<TrashIcon className="size-3 text-red-400" />

// For icon-only buttons, always include aria-label
<button aria-label="Delete item">
  <TrashIcon className="size-4" />
</button>
```

---

## How to Format Dates

Always use `date-fns`:

```tsx
import { formatDistanceToNow, format } from "date-fns"

// Relative time: "3 minutes ago"
<span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>

// Absolute: "Apr 11, 2025"
<span>{format(new Date(issue.createdAt), "MMM d, yyyy")}</span>
```

---

## How to Style Components

### Use the `navy-*` color scale — never raw Tailwind palette colors

```tsx
// ✅ Correct — uses project design tokens
<div className="bg-navy-800 text-navy-50 border-navy-500">

// ❌ Wrong — breaks visual consistency
<div className="bg-gray-800 text-white border-gray-500">
```

### Available `navy-*` tokens

| Token | Usage |
|---|---|
| `navy-950` | Deepest background (page) |
| `navy-900` / `navy-800` | Section backgrounds |
| `navy-700` | Card, input backgrounds |
| `navy-600` | Hovered elements, borders |
| `navy-500` | Subtle borders |
| `navy-400` | Focus rings |
| `navy-300` | Placeholder, muted text |
| `navy-200` | Secondary text |
| `navy-100` | Primary text (slightly dim) |
| `navy-50` | Main text (near white) |

### Merge classes with `twMerge`

```tsx
import { twMerge } from "tailwind-merge"

// Use when accepting external className prop
function Root({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={twMerge("base-classes-here", className)}
      {...props}
    />
  )
}
```

### Use `data-*` attributes for state-based styles

```tsx
// Prefer data attributes over conditional class strings
<button
  data-active={isActive}
  data-liked={isLiked}
  className="data-[active=true]:bg-navy-600 data-[liked=true]:text-indigo-400"
/>
```

---

## How to Handle Environment Variables

Always validate env vars with Zod — never read `process.env` directly anywhere else.

```ts
// Client-safe (public) vars → src/client-env.ts
import { z } from "zod"
export const clientEnv = z.object({
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:3000"),
}).parse(process.env)

// Server-only vars → src/api-env.ts
import { z } from "zod"
export const apiEnv = z.object({
  DATABASE_URL: z.url(),
  SECRET_KEY: z.string().min(32),
}).parse(process.env)
```

Rules:
- Public vars must start with `NEXT_PUBLIC_`
- Never put secrets in `NEXT_PUBLIC_*` vars
- Every new variable must be added to the appropriate schema

---

## How to Infer Types from Zod Schemas

Never manually write types for data that already has a Zod schema.

```ts
import type z from "zod"
import type { IssuesListResponseSchema } from "@/api/routes/list-issues"

// ✅ Infer from schema
type IssuesList = z.infer<typeof IssuesListResponseSchema>

// ❌ Don't duplicate manually
interface IssuesList {
  backlog: Issue[]
  todo: Issue[]
}
```

---

## Common Anti-Patterns to Avoid

```tsx
// ❌ Don't fetch inside a Client Component
"use client"
export function IssueList() {
  const [issues, setIssues] = useState([])
  useEffect(() => {
    fetch("/api/issues").then(r => r.json()).then(setIssues) // ❌ No Zod parse, no useQuery
  }, [])
}

// ✅ Do: Server Component fetches, passes data to client
export default async function IssuesPage() {
  const issues = await listIssues() // in src/http/, parsed with Zod
  return <IssueList issues={issues} /> // client component only renders
}
```

```tsx
// ❌ Don't create new components without extending ComponentProps
interface CardProps { title: string; onClick: () => void }
// ✅ Do: extend so all HTML attributes work
interface CardProps extends ComponentProps<"div"> { title: string }
```

```tsx
// ❌ Don't access process.env anywhere other than env files
const url = process.env.NEXT_PUBLIC_API_URL

// ✅ Do: import from centralized env module
import { clientEnv } from "@/client-env"
const url = clientEnv.NEXT_PUBLIC_API_URL
```

```tsx
// ❌ Don't use generic Tailwind colors
<div className="bg-white text-black border-gray-300">

// ✅ Do: use navy-* tokens
<div className="bg-navy-800 text-navy-50 border-navy-600">
```

```tsx
// ❌ Don't add "use client" to layouts, pages, or data-only components
"use client"
export default async function Page() { ... } // breaks server features

// ✅ Do: "use client" only in leaf components with interactivity
```
