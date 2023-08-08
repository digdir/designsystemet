import type { Meta, StoryObj } from '@storybook/react';

import { ToggleChip } from './';

const meta: Meta<typeof ToggleChip> = {
  title: 'Kjernekomponenter/Chip/Toggle',
  component: ToggleChip,
};

export default meta;

type Story = StoryObj<typeof ToggleChip>;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    size: 'small',
    selected: false,
    checkmark: false,
  },
};
