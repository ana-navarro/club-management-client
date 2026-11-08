import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import { SWRConfig } from 'swr'
import { CheckEmailNotice } from './CheckEmailNotice'

const meta = {
  title: 'Pages/SignUp/CheckEmailNotice',
  component: CheckEmailNotice,
  args: { email: 'ana@example.com' },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map() }}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </SWRConfig>
    ),
  ],
} satisfies Meta<typeof CheckEmailNotice>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const LongEmail: Story = { args: { email: 'a-very-long-address-for-a-small-screen@club-management.example.com' } }
export const Dark: Story = { globals: { theme: 'dark' } }
export const MobileViewport: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
