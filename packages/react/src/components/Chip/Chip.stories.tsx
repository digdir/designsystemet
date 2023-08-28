import type { Meta, StoryObj } from '@storybook/react';

import { Chip } from './index';

type Story = StoryObj<typeof Chip.Toggle>;

export default {
  title: 'Felles/Chip',
  component: Chip.Toggle,
} as Meta;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    size: 'small',
    selected: false,
    checkmark: false,
  },
};
