import type { Meta, StoryObj } from '@storybook/react';

import { RemovableChip } from './';

const meta: Meta<typeof RemovableChip> = {
  title: 'Felles/Chip/Removable',
  component: RemovableChip,
};

export default meta;

type Story = StoryObj<typeof RemovableChip>;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    size: 'small',
    'aria-label': 'Slett nynorsk',
  },
};
