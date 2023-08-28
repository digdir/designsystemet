import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from '.';

type Story = StoryObj<typeof Switch>;

export default {
  title: 'Felles/Switch',
  component: Switch,
} as Meta;

export const Preview: Story = {
  args: {
    children: 'Switch',
    description: 'Description',
    disabled: false,
    readOnly: false,
    value: 'value',
  },
};
