import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResendVerification } from './ResendVerification'

const meta = {
  title: 'Shared/ResendVerification',
  component: ResendVerification,
} satisfies Meta<typeof ResendVerification>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const KnownEmail: Story = { args: { email: 'ana@example.com' } }
export const Dark: Story = { globals: { theme: 'dark' } }
export const MobileViewport: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
