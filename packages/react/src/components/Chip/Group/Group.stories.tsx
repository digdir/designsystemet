import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';

import { Chip } from '../Chip';

import { Group } from './Group';

const meta: Meta<typeof Group> = {
  title: 'Kjernekomponenter/Chip/Group',
  component: Group,
};

export default meta;

type Story = StoryObj<typeof Group>;

export const Preview: Story = {
  args: {
    children: 'Bokmål',
    size: 'xsmall',
  },
};

export const Grouping: StoryFn<typeof Group> = ({ ...rest }): JSX.Element => {
  return (
    <Group
      size='small'
      {...rest}
    >
      <Chip>New</Chip>
      <Chip>Old</Chip>
    </Group>
  );
};
