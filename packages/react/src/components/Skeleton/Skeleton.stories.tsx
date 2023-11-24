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
        fontSize: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        width: '400px',
      }}
    >
      <div style={{ display: 'flex', fontSize: '3rem', gap: '10px' }}>
        <Skeleton.Circle />
        <Skeleton.Rectangle width='100%' />
      </div>
      <Skeleton.Text />
      <Skeleton.Text />
      <Skeleton.Text />
    </div>
  );
};
