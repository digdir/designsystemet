import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../Button';

import { Spinner } from '.';

type Story = StoryFn<typeof Spinner>;

const decorators = [
  (Story: StoryFn) => (
    <div
      style={{
        margin: '5rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-end',
      }}
    >
      <Story />
    </div>
  ),
];

export default {
  title: 'Komponenter/Loaders/Spinner',
  component: Spinner,
  decorators,
} as Meta;

export const Preview: Story = (args) => <Spinner {...args} />;

Preview.args = {
  title: 'Henter kaffi',
  size: 'md',
  color: 'neutral',
};

export const Variants: Story = () => (
  <>
    <Spinner
      title='Henter kaffi'
      color='neutral'
      size='xl'
    />
    <Spinner
      title='Henter kaffi'
      color='accent'
      size='xl'
    />
  </>
);

export const Sizes: Story = () => (
  <>
    <Spinner
      title='Henter kaffi'
      color='neutral'
      size='2xs'
    />
    <Spinner
      title='Henter kaffi'
      color='neutral'
      size='xs'
    />
    <Spinner
      title='Henter kaffi'
      color='neutral'
      size='sm'
    />
    <Spinner
      title='Henter kaffi'
      color='neutral'
      size='md'
    />
    <Spinner
      title='Henter kaffi'
      color='neutral'
      size='lg'
    />
    <Spinner
      title='Henter kaffi'
      color='neutral'
      size='xl'
    />
  </>
);

export const TestSync: Story = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button onClick={() => setShow(!show)}>Toggle</Button>
      <Spinner title='laster' />

      {show && <Spinner title='laster' />}
    </>
  );
};
