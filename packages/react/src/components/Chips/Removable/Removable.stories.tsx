import type { Meta, StoryObj } from '@storybook/react';

import Removable from './Removable';
import classes from './Removable.module.css';
import cn from 'classnames';

const meta: Meta<typeof Removable> = {
  title: 'Kjernekomponenter/Typography/Removable',
  component: Removable,
};

export default meta;

type Story = StoryObj<typeof Removable>;

export const Preview: Story = {
  args: {
    children: 'Bokmål',
    onDelete: () => {},
    className: cn(classes.chips, classes['small']),
  },
};
