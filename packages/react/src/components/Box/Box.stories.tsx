import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Box } from './Box';

type Story = StoryFn<typeof Box>;

const meta: Meta<typeof Box> = {
  title: 'Primitives/Box',
  component: Box,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Preview: Story = (args) => <Box {...args}>Box!</Box>;

Preview.args = {
  children: 'Box!',
  shadow: 'medium',
  borderRadius: 'medium',
  background: 'default',
};

export const AsHeader: Story = (args) => (
  <Box
    {...args}
    as='header'
  >
    Box!
  </Box>
);
