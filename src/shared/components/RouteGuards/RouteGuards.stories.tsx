import { Typography } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router'
import { clearSession, saveSession } from '../../services/auth-token'
import { PublicOnly, RequireAuth } from './RouteGuards'

function Example({ signedIn }: { signedIn: boolean }) {
  if (signedIn) {
    saveSession({ token: 'story', expiresAt: '2999-01-01T00:00:00Z', renewAt: '2999-01-01T00:00:00Z' })
  } else {
    clearSession()
  }
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<Typography>Página pública</Typography>} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Typography>Página protegida</Typography>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

const meta = { title: 'Shared/RouteGuards', component: Example } satisfies Meta<typeof Example>

export default meta
type Story = StoryObj<typeof meta>

export const SignedIn: Story = { args: { signedIn: true } }
export const SignedOut: Story = { args: { signedIn: false } }
export const MobileViewport: Story = {
  args: { signedIn: false },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
