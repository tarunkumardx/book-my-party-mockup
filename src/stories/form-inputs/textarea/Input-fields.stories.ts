import type { Meta, StoryObj } from '@storybook/react'
import TextArea from '.'

const meta = {
  title: 'FormInputs/InputField',
  component: TextArea,
  tags: ['autodocs']
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const _TextArea: Story = {
  args: {
    name: 'default',
    className: '',
    placeholder: 'Placeholder text',
    value: '',
    required: false,
    label: '',
    error: '',
    rows: 1
  }
};
