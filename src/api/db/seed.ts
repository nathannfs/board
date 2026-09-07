import "dotenv/config"
import { sql } from "drizzle-orm"
import { db } from "./index"
import { comments, issues } from "./schema"

type Semente = {
  title: string
  description: string
  status: "backlog" | "todo" | "in_progress" | "done"
  likes: number
  dias: number
  conversa: [string, string][]
}

const AVATAR: Record<string, string> = {
  Ana: "https://i.pravatar.cc/150?img=47",
  Bruno: "https://i.pravatar.cc/150?img=12",
  Clara: "https://i.pravatar.cc/150?img=32",
  Diego: "https://i.pravatar.cc/150?img=15",
  Elisa: "https://i.pravatar.cc/150?img=45",
  Fábio: "https://i.pravatar.cc/150?img=52",
}

const ROADMAP: Semente[] = [
  {
    title: "Keyboard shortcuts for moving a card between columns",
    description:
      "Dragging a card is fine with a mouse and painful on a laptop trackpad. People who live in this board all day want to move a card without leaving the keyboard. Cmd+1 through Cmd+4 for the four columns, and J/K to walk the list.",
    status: "in_progress",
    likes: 18,
    dias: 3,
    conversa: [
      [
        "Ana",
        "Cmd+1..4 collides with browser tab switching on Chrome. Can we use Alt instead?",
      ],
      [
        "Bruno",
        "Alt is free on all three browsers I checked. Switching to it.",
      ],
      [
        "Clara",
        "Please announce the move to screen readers too, otherwise the card just vanishes.",
      ],
    ],
  },
  {
    title: "Search should match the issue body, not only the title",
    description:
      "Right now a search for a word that appears in the description returns nothing, which makes people believe the issue was deleted. Postgres full text search over title and description, with the query staying in the URL so the result can be shared.",
    status: "done",
    likes: 24,
    dias: 11,
    conversa: [
      [
        "Diego",
        "Shipped with tsvector on title plus description, and a GIN index.",
      ],
      [
        "Ana",
        "Search for 'timezone' now returns four issues. It used to return one.",
      ],
    ],
  },
  {
    title: "Comments arrive without a page reload",
    description:
      "Two people looking at the same issue see different comment lists until one of them refreshes. The fix is to revalidate the issue after a comment lands, not to open a socket: the traffic here does not justify one.",
    status: "todo",
    likes: 9,
    dias: 5,
    conversa: [
      [
        "Elisa",
        "Do we need websockets for this? Feels heavy for a board with twelve people.",
      ],
      [
        "Bruno",
        "No. Revalidating the path after the mutation is enough and costs nothing to run.",
      ],
    ],
  },
  {
    title: "Deleting an issue takes its comments with it",
    description:
      "The foreign key already cascades, so this is a UI problem: the confirm dialog says 'delete issue' and never mentions that thirty comments go with it. Say the number out loud before the button.",
    status: "done",
    likes: 7,
    dias: 19,
    conversa: [
      [
        "Clara",
        "The dialog now reads 'Delete this issue and its 30 comments'.",
      ],
      ["Fábio", "Much better. I nearly wiped a thread last week."],
    ],
  },
  {
    title: "The like count disagrees with the like table",
    description:
      "issues.likes is a counter column and issue_likes is the source of truth. They drift whenever a request fails halfway. Either drop the counter and count rows, or update both inside the same transaction.",
    status: "in_progress",
    likes: 15,
    dias: 2,
    conversa: [
      [
        "Bruno",
        "Counting rows on every read was fine up to ten thousand likes in my test.",
      ],
      [
        "Diego",
        "Then drop the column. A number two places can disagree about is a bug waiting to happen.",
      ],
      ["Ana", "Agreed. Fewer invariants to defend."],
    ],
  },
  {
    title: "Open an issue in a modal without losing the list behind it",
    description:
      "Clicking an issue replaces the whole page, and going back loses the scroll position and the active filter. Intercepting routes give the modal on click and the full page on a direct link, which is what a shared URL needs.",
    status: "done",
    likes: 31,
    dias: 27,
    conversa: [
      [
        "Ana",
        "Direct link opens the full page, clicking from the list opens the modal. Both are the same route.",
      ],
      [
        "Elisa",
        "Refreshing inside the modal now keeps you on the issue instead of dumping you at the top.",
      ],
      ["Fábio", "This is the change people noticed most."],
    ],
  },
  {
    title: "Empty board says nothing at all",
    description:
      "A new workspace opens on four empty columns and a blank page. There is no hint of what to do next and no way to create the first issue without knowing the keyboard shortcut.",
    status: "todo",
    likes: 12,
    dias: 6,
    conversa: [
      [
        "Clara",
        "First run should show one example issue that the person can delete.",
      ],
      [
        "Diego",
        "Or a single line and a button. An example issue people then have to clean up feels like homework.",
      ],
    ],
  },
  {
    title: "Long titles break the card layout",
    description:
      "A title over roughly ninety characters pushes the status badge out of the card. Truncate at two lines with the full title in a tooltip, and stop the badge from shrinking.",
    status: "done",
    likes: 5,
    dias: 33,
    conversa: [
      [
        "Fábio",
        "line-clamp-2 on the title and shrink-0 on the badge. Two lines of CSS.",
      ],
    ],
  },
  {
    title: "Rate limit the comment endpoint",
    description:
      "Nothing stops a script from posting a thousand comments on one issue. Limit by account rather than by address: everyone behind the same office network shares an address and would punish each other.",
    status: "backlog",
    likes: 8,
    dias: 9,
    conversa: [
      [
        "Bruno",
        "Per account, not per IP. We learned that the hard way on another service.",
      ],
    ],
  },
  {
    title: "Filter the board by status from the URL",
    description:
      "The column view already groups by status, but there is no way to link someone straight to everything in progress. Keep the filter in a query parameter so the state survives a refresh and can be pasted into chat.",
    status: "todo",
    likes: 14,
    dias: 4,
    conversa: [
      [
        "Elisa",
        "nuqs handles the parsing, and the server component reads the same parameter.",
      ],
      ["Ana", "Remember shallow: false, or the server never sees the change."],
    ],
  },
  {
    title: "Comment author shows as 'User 3'",
    description:
      "Seed data leaked into the first deploy and some threads still carry placeholder names. Backfill from the account that wrote them, and fail the insert when the author is missing instead of writing a placeholder.",
    status: "done",
    likes: 3,
    dias: 41,
    conversa: [
      ["Diego", "Backfilled 214 rows. The insert now requires an author."],
    ],
  },
  {
    title: "Dark mode follows the system and never changes again",
    description:
      "The theme reads the system preference once, at first paint, and then ignores it. Someone who switches their laptop to dark at sunset keeps the light board until they reload.",
    status: "backlog",
    likes: 11,
    dias: 8,
    conversa: [
      [
        "Clara",
        "matchMedia has a change event. We are only reading the initial value.",
      ],
    ],
  },
  {
    title: "Sort the board by most liked",
    description:
      "Product wants to see what people actually want next, which the created date does not tell them. A sort control beside the search, defaulting to newest so nothing changes for people who ignore it.",
    status: "backlog",
    likes: 19,
    dias: 13,
    conversa: [
      [
        "Fábio",
        "Careful: sorting by likes turns the board into a popularity contest for bugs nobody hit.",
      ],
      ["Ana", "Then keep newest as the default and let people opt in."],
    ],
  },
  {
    title: "The API answers 500 when the body is malformed",
    description:
      "A missing field should be a 400 with the field named, not a stack trace and a 500. The zod schema already knows what is wrong; the handler just is not reading it.",
    status: "in_progress",
    likes: 6,
    dias: 1,
    conversa: [
      [
        "Bruno",
        "The OpenAPI route already carries the schema. Mapping its error to a 400 is a few lines.",
      ],
      ["Elisa", "Please include the field path. 'Invalid body' helps nobody."],
    ],
  },
  {
    title: "Show who is assigned to an issue",
    description:
      "There is no assignee, so the board answers what is being worked on but not by whom. One person per issue for now, chosen from the workspace members, and nothing to migrate later if it becomes many.",
    status: "backlog",
    likes: 22,
    dias: 16,
    conversa: [
      [
        "Diego",
        "One assignee now, a join table when someone actually asks for two.",
      ],
      [
        "Clara",
        "Avatar on the card, name in the modal. The card is already tight.",
      ],
    ],
  },
  {
    title: "Loading state flashes on a fast connection",
    description:
      "The skeleton appears for eighty milliseconds and then disappears, which reads as a glitch rather than as loading. Hold the skeleton for a minimum time once it shows, or delay showing it at all.",
    status: "done",
    likes: 4,
    dias: 22,
    conversa: [
      [
        "Ana",
        "Delaying the skeleton by 150ms killed the flash without making anything feel slower.",
      ],
    ],
  },
]

async function main() {
  await db.execute(sql`truncate table comments cascade`)
  await db.execute(sql`truncate table issues cascade`)
  await db.execute(sql`alter sequence issue_number_seq restart with 1`)

  // Oldest first: `issueNumber` comes from a Postgres sequence, and the board
  // reads wrong if number 1 is the most recent thing on it.
  const emOrdem = [...ROADMAP].sort((a, b) => b.dias - a.dias)

  for (const item of emOrdem) {
    const criadoEm = new Date(Date.now() - item.dias * 24 * 60 * 60 * 1000)

    const [issue] = await db
      .insert(issues)
      .values({
        title: item.title,
        description: item.description,
        status: item.status,
        likes: item.likes,
        createdAt: criadoEm,
      })
      .returning()

    for (const [indice, [autor, texto]] of item.conversa.entries()) {
      await db.insert(comments).values({
        issueId: issue.id,
        authorName: autor,
        authorAvatar: AVATAR[autor],
        text: texto,
        createdAt: new Date(criadoEm.getTime() + (indice + 1) * 3600 * 1000),
      })
    }
  }

  console.log(`pronto: ${ROADMAP.length} issues`)
  process.exit(0)
}

main().catch((error) => {
  console.error("falhou ao semear:", error)
  process.exit(1)
})
