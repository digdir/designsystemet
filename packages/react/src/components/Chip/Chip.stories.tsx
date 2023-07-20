import type { Meta, StoryObj } from '@storybook/react';

import { Chip } from './index';

type Story = StoryObj<typeof Chip>;

export default {
  title: 'Kjernekomponenter/Chip',
  component: Chip.Toggle,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    size: 'small',
    selected: false,
    checkmark: false,
  },
};
