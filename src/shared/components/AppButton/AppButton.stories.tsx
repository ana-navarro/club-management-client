import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppButton } from './AppButton'

const meta = {
  title: 'Shared/AppButton',
  component: AppButton,
  args: { children: 'Salvar' },
} satisfies Meta<typeof AppButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Loading: Story = { args: { loading: true } }
export const Disabled: Story = { args: { disabled: true } }
export const MobileViewport: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
