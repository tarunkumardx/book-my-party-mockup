import type { Meta, StoryObj } from '@storybook/react'
import InputField from '.'

const meta = {
  title: 'FormInputs/InputField',
  component: InputField,
  tags: ['autodocs']
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const _InputField: Story = {
  args: {
    name: 'default',
    type: 'text',
    className: '',
    autoComplete: 'off',
    placeholder: 'placeholder',
    values: [],
    checked: false,
    label: '',
    error: '',
    required: false,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => { console.log(event) }
  }
};
