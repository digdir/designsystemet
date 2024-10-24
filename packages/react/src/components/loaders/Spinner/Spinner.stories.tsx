import type { Meta, StoryFn } from '@storybook/react';

import { Spinner } from '.';

type Story = StoryFn<typeof Spinner>;

export default {
  title: 'Komponenter/Loaders/Spinner',
  component: Spinner,
  parameters: {
    customStyles: {
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: 'repeat(3, auto)',
      placeItems: 'center',
    },
  },
} as Meta;

export const Preview: Story = (args) => <Spinner {...args} />;

Preview.args = {
  title: 'Henter kaffi',
  'data-size': 'md',
  color: 'neutral',
};

export const Variants: Story = () => (
  <>
    <Spinner title='Henter kaffi' color='neutral' data-size='xl' />
    <Spinner title='Henter kaffi' color='accent' data-size='xl' />
  </>
);

export const Sizes: Story = () => (
  <>
    <Spinner title='Henter kaffi' color='neutral' data-size='2xs' />
    <Spinner title='Henter kaffi' color='neutral' data-size='xs' />
    <Spinner title='Henter kaffi' color='neutral' data-size='sm' />
    <Spinner title='Henter kaffi' color='neutral' data-size='md' />
    <Spinner title='Henter kaffi' color='neutral' data-size='lg' />
    <Spinner title='Henter kaffi' color='neutral' data-size='xl' />
  </>
);
