import type { Meta, StoryObj } from '@storybook/react';

import { Chip } from './Chip';

type Story = StoryObj<typeof Chip>;

export default {
  title: 'Kjernekomponenter/Chips',
  component: Chip,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

export const Preview: Story = {
  args: {
    children: 'Hello',
  },
};
