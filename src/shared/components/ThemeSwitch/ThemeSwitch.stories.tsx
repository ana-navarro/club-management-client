import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeSwitch } from './ThemeSwitch'

const meta = { title: 'Shared/ThemeSwitch', component: ThemeSwitch } satisfies Meta<typeof ThemeSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Dark: Story = { globals: { theme: 'dark' } }
export const MobileViewport: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
