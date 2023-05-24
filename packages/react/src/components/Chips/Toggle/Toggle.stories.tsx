import type { Meta, StoryObj } from '@storybook/react';
import cn from 'classnames';

import Toggle from './Toggle';
import classes from './Toggle.module.css';

const meta: Meta<typeof Toggle> = {
  title: 'Kjernekomponenter/Typography/Toggle',
  component: Toggle,
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    selected: false,
    className: cn(classes.chips, classes['small']),
  },
};
