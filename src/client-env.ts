import { z } from "zod"

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().optional().default("http://localhost:3000"),
})

// Cada variável é nomeada uma a uma, e não `parse(process.env)`. No navegador o
// Next substitui `process.env.NEXT_PUBLIC_X` pelo valor durante o build, mas só
// quando a chave aparece escrita no código. Passando o objeto inteiro, o cliente
// recebe `{}` e cai no padrão, que é o endereço da máquina de quem compilou.
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})
