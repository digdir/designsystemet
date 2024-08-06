import type { Meta, StoryObj } from '@storybook/react';

import { ToggleChip } from './Toggle';

const meta: Meta<typeof ToggleChip> = {
  title: 'Komponenter/Chip/Toggle',
  component: ToggleChip,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ToggleChip>;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    size: 'md',
    selected: false,
    checkmark: false,
    disabled: false,
  },
};
