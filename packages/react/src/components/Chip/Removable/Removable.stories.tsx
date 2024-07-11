import type { Meta, StoryObj } from '@storybook/react';

import { RemovableChip } from './Removable';

export default {
  title: 'Komponenter/Chip/Removable',
  component: RemovableChip,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
  },
} as Meta;

type Story = StoryObj<typeof RemovableChip>;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    size: 'md',
    'aria-label': 'Slett nynorsk',
    disabled: false,
  },
};
