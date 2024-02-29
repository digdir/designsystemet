import type { Meta, StoryObj } from '@storybook/react';

import { ToggleChip } from './Toggle';

const meta: Meta<typeof ToggleChip> = {
  title: 'Komponenter/Chip/Toggle',
  component: ToggleChip,
};

export default meta;

type Story = StoryObj<typeof ToggleChip>;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    size: 'medium',
    selected: false,
    checkmark: false,
    disabled: false,
  },
};
