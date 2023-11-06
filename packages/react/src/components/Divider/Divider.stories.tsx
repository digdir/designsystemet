import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Divider } from './';

type Story = StoryFn<typeof Divider>;

export default {
  title: 'Primitives/Divider',
  component: Divider,
} as Meta;

export const Preview: Story = (args) => (
  <div
    style={{
      width: '300px',
    }}
  >
    <Divider {...args} />
  </div>
);
Preview.args = {
  color: 'default',
};
