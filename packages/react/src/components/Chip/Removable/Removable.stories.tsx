import type { Meta, StoryObj } from '@storybook/react';

import { RemovableChip } from './Removable';

const meta: Meta<typeof RemovableChip> = {
  title: 'Kjernekomponenter/Chip/Removable',
  component: RemovableChip,
};

export default meta;

type Story = StoryObj<typeof RemovableChip>;

export const Preview: Story = {
  args: {
    children: 'Bokmål',
  },
};
