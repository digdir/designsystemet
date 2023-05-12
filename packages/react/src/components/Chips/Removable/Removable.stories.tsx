import type { Meta, StoryObj } from '@storybook/react';
import cn from 'classnames';

import Removable from './Removable';
import classes from './Removable.module.css';

const meta: Meta<typeof Removable> = {
  title: 'Kjernekomponenter/Typography/Removable',
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
    className: cn(classes.chips, classes['small']),
  },
};
