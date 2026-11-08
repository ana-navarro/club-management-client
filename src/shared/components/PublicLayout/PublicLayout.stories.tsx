import { Typography } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PublicLayout } from './PublicLayout'

const meta = {
  title: 'Shared/PublicLayout',
  component: PublicLayout,
  args: { title: 'Entrar', children: <Typography>Conteúdo</Typography> },
} satisfies Meta<typeof PublicLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Dark: Story = { globals: { theme: 'dark' } }
export const MobileViewport: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
