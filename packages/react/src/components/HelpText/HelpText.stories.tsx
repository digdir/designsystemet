import type { Meta, StoryFn, StoryObj } from '@storybook/react';

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
  title: 'Komponenter/HelpText',
  component: HelpText,
} as Meta;

export const Preview: Story = {
  args: {
    title: 'Help text title',
    children: 'Help text content',
    size: 'medium',
  },
  decorators,
};

export const Portal: Story = {
  args: {
    title: 'Help text title',
    children: 'Help text content',
    size: 'medium',
    portal: true,
    placement: 'top',
  },
};
