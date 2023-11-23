import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Circle } from './Circle';

type Story = StoryObj<typeof Circle>;

export default {
  title: 'Felles/Skeleton/Circle',
  component: Circle,
} as Meta;

export const Preview: Story = {
  args: {
    width: 10,
    height: '10px',
  },
};
