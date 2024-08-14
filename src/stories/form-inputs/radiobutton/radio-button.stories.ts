import type { Meta, StoryObj } from '@storybook/react'
import RadioButton from '.'

const meta = {
  title: 'FormInputs/RadioButton',
  component: RadioButton,
  tags: ['autodocs']
} satisfies Meta<typeof RadioButton>

export default meta
type Story = StoryObj<typeof meta>

export const _RadioButton: Story = {
  args: {
    name: 'Radio-button',
    className: '',
    value: [],
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' }
    ],
    checked: false,
    label: '',
    error: '',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log('Checkbox changed:', event.target.checked);
    },
    displayInline: false
  }
}
