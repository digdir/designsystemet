import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Chip } from '..';

import { Group } from './';

const meta: Meta<typeof Group> = {
  title: 'Kjernekomponenter/Chip/Group',
  component: Group,
};

export default meta;

type Story = StoryObj<typeof Group>;

export const Preview: Story = {
  args: {
    children: (
      <Chip.Group>
        <Chip.Toggle>Nynorsk</Chip.Toggle>
        <Chip.Toggle>Bokmål</Chip.Toggle>
      </Chip.Group>
    ),
    size: 'small',
  },
};
