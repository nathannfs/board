import "dotenv/config"
import { auth } from "../auth"

/**
 * Creates the single guest account.
 *
 * Registration is disabled in Better Auth, so this account cannot come from
 * the public API. It is created here, with the same hash function the sign-in
 * uses to check the password.
 */
async function main() {
  const email = "guest@nathannfs.com"
  const senha = process.env.DEMO_PASSWORD

  if (!senha) throw new Error("DEMO_PASSWORD ausente")

  const ctx = await auth.$context
  const existente = await ctx.internalAdapter.findUserByEmail(email)

  if (existente) {
    console.log("guest already exists")
    process.exit(0)
  }

  const user = await ctx.internalAdapter.createUser({
    email,
    name: "Guest",
    emailVerified: true,
    image: "https://i.pravatar.cc/150?img=68",
  })

  await ctx.internalAdapter.linkAccount({
    userId: user.id,
    providerId: "credential",
    accountId: user.id,
    password: await ctx.password.hash(senha),
  })

  console.log("guest created:", user.id)
  process.exit(0)
}

main().catch((erro) => {
  console.error("falhou:", erro)
  process.exit(1)
})
