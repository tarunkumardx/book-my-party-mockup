import type { Meta, StoryObj } from '@storybook/react'
import Logo from '.'

const meta = {
  title: 'Pages/Logo',
  component: Logo

} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const _Logo: Story = {

}
