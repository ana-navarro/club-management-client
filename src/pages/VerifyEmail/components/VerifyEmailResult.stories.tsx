import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import { SWRConfig } from 'swr'
import { VerifyEmailResult } from './VerifyEmailResult'

const meta = {
  title: 'Pages/VerifyEmail/VerifyEmailResult',
  component: VerifyEmailResult,
  args: { state: 'confirmed' },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map() }}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </SWRConfig>
    ),
  ],
} satisfies Meta<typeof VerifyEmailResult>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Loading: Story = { args: { state: 'loading' } }
export const Error: Story = { args: { state: 'invalid' } }
export const Unavailable: Story = { args: { state: 'unavailable' } }
export const Dark: Story = { globals: { theme: 'dark' } }
export const MobileViewport: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
