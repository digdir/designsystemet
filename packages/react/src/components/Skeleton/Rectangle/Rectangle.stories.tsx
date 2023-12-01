import React from 'react';
import type { Meta, StoryObj, StoryFn } from '@storybook/react';

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

export const RectangleExample: StoryFn<typeof Rectangle> = () => {
  return (
    <div
      style={{
        fontSize: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '500px',
      }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <Rectangle
          width='30%'
          height='100px'
        />
        <Rectangle height='100px' />
      </div>
      <Rectangle />
      <Rectangle />
      <Rectangle />
      <Rectangle />
    </div>
  );
};
