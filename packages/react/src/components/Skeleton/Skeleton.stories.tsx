import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Skeleton } from '.';

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '2rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Felles/Skeleton',
  component: Skeleton,
  decorators,
} as Meta;

export const Preview: StoryFn<typeof Skeleton> = (args) => {
  return <Skeleton />;
};
