import type { Meta, StoryObj } from '@storybook/react';

import { HelpText } from '.';

type Story = StoryObj<typeof HelpText>;

export default {
  title: 'Felles/HelpText',
  component: HelpText,
} as Meta;

export const Preview: Story = {
  args: {
    title: 'Help text title',
    children: 'Help text content',
    size: 'medium',
  },
};
