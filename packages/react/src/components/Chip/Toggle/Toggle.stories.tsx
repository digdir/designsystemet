import type { Meta, StoryObj } from '@storybook/react';
import cn from 'classnames';

import { ToggleChip } from './Toggle';


const meta: Meta<typeof ToggleChip> = {
  title: 'Kjernekomponenter/Chip/Toggle',
  component: ToggleChip,
};

export default meta;

type Story = StoryObj<typeof ToggleChip>;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    selected: false,
  },
};
