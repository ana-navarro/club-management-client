import type { Meta, StoryObj } from '@storybook/react-vite'
import { SocialLoginButtons } from './SocialLoginButtons'

const meta = {
  title: 'Shared/SocialLoginButtons',
  component: SocialLoginButtons,
} satisfies Meta<typeof SocialLoginButtons>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const FacebookOnly: Story = { args: { providers: ['facebook'] } }
export const Dark: Story = { globals: { theme: 'dark' } }
export const MobileViewport: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
