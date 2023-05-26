import type { Meta, StoryObj } from '@storybook/react';

import Removable from './Removable';

const meta: Meta<typeof Removable> = {
  title: 'Kjernekomponenter/Chip/Removable',
  component: Removable,
};

export default meta;

type Story = StoryObj<typeof Removable>;

export const Preview: Story = {
  args: {
    children: 'Bokmål',
    onDelete: () => {
      console.log('Removing');
    },
  },
};
