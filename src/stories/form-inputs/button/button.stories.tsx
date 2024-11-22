import type { Meta, StoryObj } from '@storybook/react'
import Button from '.'

const meta = {
  title: 'FormInputs/Button',
  component: Button,
  tags: ['autodocs']
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const _Button: Story = {
  args: {
    label: 'Click me',
    className: 'primary',
    type: 'button',
    loading: false,
    disabled: false,
    onClick: () => alert('Button Clicked!')
  }
};