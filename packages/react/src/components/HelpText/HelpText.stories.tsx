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
  'aria-label': 'Komponenter/HelpText',
  component: HelpText,
} as Meta;

export const Preview: Story = {
  args: {
    'aria-label': 'Help text title',
    children: 'Help text content',
    size: 'md',
  },
  decorators,
};
