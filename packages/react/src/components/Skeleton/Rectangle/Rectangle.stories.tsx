import type { Meta, StoryObj } from '@storybook/react';

import { Rectangle } from './Rectangle';

type Story = StoryObj<typeof Rectangle>;

export default {
  title: 'Felles/Skeleton/Rectangle',
  component: Rectangle,
} as Meta;

export const Preview: Story = {
  args: {
    width: '500px',
    height: '50px',
  },
};
