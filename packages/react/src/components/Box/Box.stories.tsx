import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Box } from './Box';

type Story = StoryFn<typeof Box>;

export default {
  title: 'Felles/Box',
  component: Box,
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Preview: Story = (args) => <Box {...args}>Box!</Box>;

Preview.args = {
  children: 'Box!',
  shadow: 'medium',
  padding: 'medium',
};
