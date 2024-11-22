import type { Meta, StoryObj } from '@storybook/react'
import SelectField from '.'

const meta = {
  title: 'FormInputs/SelectField',
  component: SelectField

} satisfies Meta<typeof SelectField>

export default meta
type Story = StoryObj<typeof meta>

export const _SelectField: Story = {

}
