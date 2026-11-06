import type { ZodType } from 'zod'

const API_BASE_PATH = '/api'

export async function getJson<T>(path: string, schema: ZodType<T>): Promise<T> {
  const response = await fetch(`${API_BASE_PATH}${path}`)
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`)
  }
  return schema.parse(await response.json())
}
