import type { Meta, StoryObj } from '@storybook/react';

import { Radio } from '.';

type Story = StoryObj<typeof Radio>;

export default {
  title: 'Felles/Radio',
  component: Radio,
} as Meta;

export const Preview: Story = {
  args: {
    children: 'Radio',
    description: 'Description',
    disabled: false,
    readOnly: false,
    value: 'value',
  },
};

export const Single: Story = {
  args: {
    value: 'value',
    'aria-label': 'Radio',
  },
};
