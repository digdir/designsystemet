import type { Meta, StoryObj } from '@storybook/react';

import { RemovableChip } from './Removable';

const meta: Meta<typeof RemovableChip> = {
  title: 'Komponenter/Chip/Removable',
  component: RemovableChip,
};

export default meta;

type Story = StoryObj<typeof RemovableChip>;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    size: 'medium',
    'aria-label': 'Slett nynorsk',
    disabled: false,
  },
};
