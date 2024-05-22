import type { Meta, StoryObj } from '@storybook/react';

import { Radio } from '.';

type Story = StoryObj<typeof Radio>;

export default {
  title: 'Komponenter/Radio',
  component: Radio,
} as Meta;

export const Preview: Story = {
  args: {
    children: 'Radio',
    description: 'Description',
    disabled: false,
    readOnly: false,
    value: 'value',
    size: 'md',
  },
};

export const Single: Story = {
  args: {
    value: 'value',
    'aria-label': 'Radio',
  },
};
