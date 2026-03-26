"use client"

import { Loader2, LogInIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function UserButton() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  async function handleSignIn() {
    await authClient.signIn.social({ provider: "github", callbackURL: "/" })
  }

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  return (
    <>
      {isPending ? (
        <div className="size-8 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center">
          <Loader2 className="size-3.5 text-navy-200 animate-spin" />
        </div>
      ) : session?.user ? (
        <button
          type="button"
          onClick={handleSignOut}
          className="size-8 rounded-full overflow-hidden cursor-pointer"
        >
          {/** biome-ignore lint/performance/noImgElement: <Github already optimizes that image> */}
          <img
            src={session.user.image ?? ""}
            alt={session.user.name}
            className="size-8 rounded-full"
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSignIn}
          className="size-8 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center hover:bg-navy-600 transition-colors duration-150 cursor-pointer"
        >
          <LogInIcon className="size-3.5 text-navy-200" />
        </button>
      )}
    </>
  )
}
