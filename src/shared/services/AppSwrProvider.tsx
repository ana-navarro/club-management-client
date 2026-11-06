import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { fetcher } from './http-client'

export function AppSwrProvider({ children }: { children: ReactNode }) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>
}
