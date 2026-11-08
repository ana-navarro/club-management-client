import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import { SWRConfig } from 'swr'
import { SignUpForm } from './SignUpForm'

const meta = {
  title: 'Pages/SignUp/SignUpForm',
  component: SignUpForm,
  args: { onSent: () => undefined },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map() }}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </SWRConfig>
    ),
  ],
} satisfies Meta<typeof SignUpForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Dark: Story = { globals: { theme: 'dark' } }
export const MobileViewport: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
