import type { Meta, StoryObj } from '@storybook/react'
import Navigation from '.'

const meta = {
  title: 'Pages/Navigation',
  component: Navigation,
  tags: ['autodocs']
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>

export const _Navigation: Story = {
  args: {
    items: [
      { label: 'home', path: 'home' },
      { label: 'home', path: 'home' },
      { label: 'home', path: 'home' },
      { label: 'home', path: 'home' }
    ],
    layout: 'horizontal'
  }
};
