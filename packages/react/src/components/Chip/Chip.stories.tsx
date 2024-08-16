import type { Meta, StoryObj } from '@storybook/react';

import { Chip } from '.';

type Story = StoryObj<typeof Chip.Toggle>;

export default {
  title: 'Komponenter/Chip',
  component: Chip.Toggle,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
  },
} as Meta;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    size: 'md',
    selected: false,
    checkmark: false,
  },
};
