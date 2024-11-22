import type { Meta, StoryObj } from '@storybook/react';
import CheckBox from '.';

const meta: Meta = {
  title: 'FormInputs/CheckBox',
  component: CheckBox,
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof meta>;

export const _CheckBox: Story = {
  args: {
    name: 'CheckBox',
    className: '',
    values: [],
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
};
