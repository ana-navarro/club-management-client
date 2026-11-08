import { z } from 'zod'

export const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark']).nullable(),
  language: z.enum(['pt-BR', 'en']).nullable(),
})

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  type: z.enum(['ADMIN', 'CLIENT']),
  clubs: z.array(z.object({ id: z.string(), name: z.string() })),
  preferences: preferencesSchema,
})

export type Preferences = z.infer<typeof preferencesSchema>
export type User = z.infer<typeof userSchema>
