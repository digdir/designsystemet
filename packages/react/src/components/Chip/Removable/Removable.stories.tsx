import type { Meta, StoryObj } from '@storybook/react';
import cn from 'classnames';

import { RemovableChip } from './Removable';
import classes from './Removable.module.css';

const meta: Meta<typeof RemovableChip> = {
  title: 'Kjernekomponenter/Chip/Removable',
  component: RemovableChip,
};

export default meta;

type Story = StoryObj<typeof RemovableChip>;

export const Preview: Story = {
  args: {
    children: 'Norsk',
  },
};
