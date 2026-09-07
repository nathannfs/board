# Board

A public product roadmap. Anyone can read the issues; signing in lets you
comment and vote. Four columns, from backlog to done.

**Live: [board.nathannfs.com](https://board.nathannfs.com)** — the button in the
corner signs you in as a guest, so you can comment and vote without an account.

I also use this repository as the starting point for new projects. The board is
the reference implementation: a real feature built the way the conventions here
say to build one.

## The idea worth stealing

The HTTP API is a Hono app that lives inside Next.js. One catch-all route
handler mounts it:

```ts
// src/app/api/[[...route]]/route.ts
import { handle } from "hono/vercel"
import app from "@/api"

export const GET = handle(app)
export const POST = handle(app)
```

That gives you one deployment instead of two, one `tsconfig`, and a single set
of Zod schemas that validate the request, type the response, and generate the
OpenAPI document. The docs at `/api/docs` are not written by hand; they are the
same schemas the routes run on, rendered by Scalar.

Route handlers get their input already parsed, so nothing downstream re-checks
what a field contains:

```ts
// src/api/routes/create-comment.ts
export const createComment = app.openapi(route, async (c) => {
  const { id } = c.req.valid("param")
  const body = c.req.valid("json")
  const user = c.get("user")

  if (!user) {
    return c.json({ error: "Unauthorized", message: "You must be signed in" }, 401)
  }
  // ...
})
```

## What is in here

**11 API routes** over issues, comments and likes, each one an `OpenAPIHono`
route with its request and response schema.

**Postgres through Drizzle.** Issues carry a human-readable number from a
Postgres sequence, so the URL reads `/issues/42` and not a UUID. Likes are a
join table with a unique pair, which is what makes a second vote from the same
person a no-op instead of a duplicate.

**Better Auth** with GitHub as the social provider, and a credentials path used
for the guest account on the live demo.

**Next 16 App Router.** Opening an issue from the board intercepts into a
modal (`src/app/@modal/(.)issues/[id]`), and the same URL loads a full page on
a refresh or a direct visit. Pages are Server Components; the parts that wait
on data sit behind Suspense so the shell is not held back. Filter state lives
in the URL through nuqs, so a filtered board is a link you can send.

**Conventions written down.** `.github/copilot-instructions.md` and
`.cursor/rules/` describe how a page, a route and a component are supposed to
be built here. They exist so the rules survive being away from the project for
a month.

## Running it

Postgres, then the schema, then the seed:

```sh
docker compose up -d
pnpm install
cp .env.example .env   # DATABASE_URL, BETTER_AUTH_SECRET, GitHub OAuth
pnpm db:migrate
pnpm db:seed
pnpm dev
```

The seed writes sixteen issues with a real conversation on them, which is the
only way to tell whether a board reads well.

Signing in needs a GitHub OAuth application, which is a nuisance for a
deployment people are only meant to look at. Set `DEMO_MODE=true` and a
`DEMO_PASSWORD`, run `pnpm db:seed:guest`, and the header offers a shared guest
account instead. The password is spent in a server action, so it never reaches
the browser.

`pnpm lint` and `pnpm format` run Biome.

## Stack

Next.js 16.2, React 19.2, Hono 4.9 with `@hono/zod-openapi`, Drizzle ORM,
Postgres, Better Auth 1.3, TanStack Query 5, Zod 4, Tailwind 4, nuqs, Biome.
