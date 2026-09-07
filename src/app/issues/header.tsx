import { apiEnv } from "@/api-env"
import { UserButton } from "@/components/header/user-button"

export function Header() {
  const guest = Boolean(apiEnv.DEMO_MODE) && !apiEnv.GITHUB_CLIENT_ID

  return (
    <div className="max-w-225 mx-auto w-full flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="font-semibold text-xl">Product Roadmap</h1>
        <p className="text-sm text-navy-100">
          Follow the development progress of our entire platform.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <UserButton guest={guest} />
      </div>
    </div>
  )
}
