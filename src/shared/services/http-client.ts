import { z, type ZodType } from 'zod'
import { clearSession, getToken } from './auth-token'

const API_BASE_PATH = '/api'

const errorBodySchema = z.object({ error: z.string() })

export class HttpError extends Error {
  readonly status: number
  readonly code?: string

  constructor(path: string, status: number, code?: string) {
    super(`Request to ${path} failed with status ${status}`)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}

async function send(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (init.body) headers['Content-Type'] = 'application/json'

  const response = await fetch(`${API_BASE_PATH}${path}`, { ...init, headers })

  if (!response.ok) {
    if (response.status === 401 && token) clearSession('expired')
    const body = errorBodySchema.safeParse(await response.json().catch(() => null))
    throw new HttpError(path, response.status, body.success ? body.data.error : undefined)
  }

  return response
}

export async function getJson<T>(path: string, schema: ZodType<T>): Promise<T> {
  return schema.parse(await (await send(path)).json())
}

export async function postJson<T>(path: string, schema: ZodType<T>, body?: object): Promise<T> {
  const response = await send(path, { method: 'POST', body: body && JSON.stringify(body) })
  return schema.parse(await response.json())
}

export async function postWithoutResponse(path: string, body: object): Promise<void> {
  await send(path, { method: 'POST', body: JSON.stringify(body) })
}

export async function patchJson<T>(path: string, schema: ZodType<T>, body: object): Promise<T> {
  const response = await send(path, { method: 'PATCH', body: JSON.stringify(body) })
  return schema.parse(await response.json())
}
