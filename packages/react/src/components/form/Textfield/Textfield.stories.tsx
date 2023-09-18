import type { Meta, StoryObj } from '@storybook/react';

import { Textfield } from '.';

type Story = StoryObj<typeof Textfield>;

export default {
  title: 'Felles/Textfield',
  component: Textfield,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Label',
    description: 'Description',
    disabled: false,
    readOnly: false,
    error: '',
  },
};
