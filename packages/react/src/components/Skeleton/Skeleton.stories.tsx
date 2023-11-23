import React from 'react';
import type { Meta, StoryObj, StoryFn } from '@storybook/react';

import { Skeleton } from '.';

type Story = StoryObj<typeof Skeleton.Circle>;

export default {
  title: 'Felles/Skeleton',
  component: Skeleton.Circle,
} as Meta;

export const Preview: Story = {
  args: {
    width: '100px',
    height: '100px',
  },
};

export const Other: StoryFn<typeof Skeleton> = (args) => {
  return (
    <div
      style={{
        fontSize: '4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
      }}
    >
      <div style={{ display: 'flex', fontSize: '10rem', gap: '5px' }}>
        <Skeleton.Circle
          width='100px'
          height='100px'
        />
        <Skeleton.Circle />
      </div>
      <Skeleton.Circle />
      <Skeleton.Circle />
      <Skeleton.Circle />
      <Skeleton.Circle />
    </div>
  );
};
