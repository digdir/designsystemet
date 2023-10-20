import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Spinner } from '.';

type Story = StoryFn<typeof Spinner>;

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '5rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Felles/Spinner',
  component: Spinner,
  decorators,
} as Meta;

export const Preview: Story = (args) => <Spinner {...args} />;

Preview.args = {
  title: 'Henter kaffi',
  size: 'medium',
  variant: 'default',
};

export const Variants: Story = () => (
  <>
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='3xLarge'
    />
    <Spinner
      title='Henter kaffi'
      variant='interaction'
      size='3xLarge'
    />
    <Spinner
      title='Henter kaffi'
      variant='inverted'
      size='3xLarge'
    />
  </>
);
