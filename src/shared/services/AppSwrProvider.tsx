import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'

export function AppSwrProvider({ children }: { children: ReactNode }) {
  return <SWRConfig value={{ errorRetryCount: 3 }}>{children}</SWRConfig>
}
