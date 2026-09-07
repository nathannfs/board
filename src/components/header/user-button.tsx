"use client"

import { Loader2, LogInIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { signInAsGuest } from "@/app/(board)/header/guest-action"
import { authClient } from "@/lib/auth-client"

export function UserButton({ guest = false }: { guest?: boolean }) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [signingIn, startSignIn] = useTransition()

  async function handleSignIn() {
    if (guest) {
      startSignIn(async () => {
        await signInAsGuest()
        // A full reload rather than `router.refresh`: the Better Auth session
        // lives in a client store the router refresh does not touch.
        window.location.reload()
      })
      return
    }

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
      {isPending || signingIn ? (
        <div className="size-8 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center">
          <Loader2 className="size-3.5 text-navy-200 animate-spin" />
        </div>
      ) : session?.user ? (
        <button
          type="button"
          onClick={handleSignOut}
          title="Sign out"
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
          title={guest ? "Sign in as a guest" : "Sign in with GitHub"}
          className="size-8 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center hover:bg-navy-600 transition-colors duration-150 cursor-pointer"
        >
          <LogInIcon className="size-3.5 text-navy-200" />
        </button>
      )}
    </>
  )
}
