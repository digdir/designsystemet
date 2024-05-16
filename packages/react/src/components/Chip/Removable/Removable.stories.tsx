import type { Meta, StoryObj } from '@storybook/react';

import { RemovableChip } from './Removable';

export default {
  title: 'Komponenter/Chip/Removable',
  component: RemovableChip,
} as Meta;

type Story = StoryObj<typeof RemovableChip>;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    size: 'medium',
    'aria-label': 'Slett nynorsk',
    disabled: false,
  },
};
