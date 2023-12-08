import type { Meta, StoryObj } from '@storybook/react';

import { Text } from './Text';

type Story = StoryObj<typeof Text>;

export default {
  title: 'Felles/Skeleton/Text',
  component: Text,
} as Meta;

export const Preview: Story = {
  args: {
    width: '100px',
  },
};
