import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import type { SocialLinkPreview } from '../services/useSocialLink'
import { SocialLinkResult } from './SocialLinkResult'

const preview: SocialLinkPreview = { provider: 'facebook', profileName: 'Ana FB', email: 'ana@example.com' }

const meta = {
  title: 'Pages/ConfirmSocialLink/SocialLinkResult',
  component: SocialLinkResult,
  args: {
    state: { status: 'ready', preview, sending: null, failed: false },
    onConfirm: () => undefined,
    onDecline: () => undefined,
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof SocialLinkResult>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Loading: Story = { args: { state: { status: 'loading' } } }
export const Sending: Story = { args: { state: { status: 'ready', preview, sending: 'confirm', failed: false } } }
export const Error: Story = { args: { state: { status: 'ready', preview, sending: null, failed: true } } }
export const Confirmed: Story = { args: { state: { status: 'confirmed' } } }
export const Declined: Story = { args: { state: { status: 'declined' } } }
export const InvalidLink: Story = { args: { state: { status: 'invalid' } } }
export const Dark: Story = { globals: { theme: 'dark' } }
export const MobileViewport: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
