import type { Meta, StoryObj } from '@storybook/react-vite'
import { LanguageSwitch } from './LanguageSwitch'

const meta = { title: 'Shared/LanguageSwitch', component: LanguageSwitch } satisfies Meta<typeof LanguageSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Portuguese: Story = { globals: { language: 'pt-BR' } }
export const English: Story = { globals: { language: 'en' } }
export const MobileViewport: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
