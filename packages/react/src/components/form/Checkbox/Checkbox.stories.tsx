import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '.';

type Story = StoryObj<typeof Checkbox>;

export default {
  title: 'Felles/Checkbox',
  component: Checkbox,
} as Meta;

export const Preview: Story = {
  args: {
    children: 'Checkbox',
    description: 'Description',
    disabled: false,
    readOnly: false,
    value: 'value',
  },
};

export const Single: Story = {
  args: {
    value: 'value',
    'aria-label': 'Checkbox',
  },
};
