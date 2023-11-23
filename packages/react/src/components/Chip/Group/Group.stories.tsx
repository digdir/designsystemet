import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Chip } from '..';

import { Group } from './Group';

const meta: Meta<typeof Group> = {
  title: 'Felles/Chip/Group',
  component: Group,
};

export default meta;

type Story = StoryFn<typeof Group>;

export const Preview: Story = (args) => (
  <Chip.Group {...args}>
    <Chip.Removable>Nynorsk</Chip.Removable>
    <Chip.Toggle>Bokmål</Chip.Toggle>
  </Chip.Group>
);

Preview.args = {
  size: 'small',
};
