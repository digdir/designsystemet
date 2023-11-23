import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';

import { HelpText } from '.';

type Story = StoryObj<typeof HelpText>;

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '5rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Felles/HelpText',
  component: HelpText,
  decorators,
} as Meta;

export const Preview: Story = {
  args: {
    title: 'Help text title',
    children: 'Help text content',
    size: 'medium',
  },
};
