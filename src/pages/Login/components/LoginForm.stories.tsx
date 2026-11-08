import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import { SWRConfig } from 'swr'
import { LoginForm } from './LoginForm'

const meta = {
  title: 'Pages/Login/LoginForm',
  component: LoginForm,
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map() }}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </SWRConfig>
    ),
  ],
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Dark: Story = { globals: { theme: 'dark' } }
export const MobileViewport: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
