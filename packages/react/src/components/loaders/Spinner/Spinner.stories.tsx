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
  size: 'md',
  color: 'neutral',
};

export const Variants: Story = () => (
  <>
    <Spinner title='Henter kaffi' color='neutral' size='xl' />
    <Spinner title='Henter kaffi' color='accent' size='xl' />
  </>
);

export const Sizes: Story = () => (
  <>
    <Spinner title='Henter kaffi' color='neutral' size='2xs' />
    <Spinner title='Henter kaffi' color='neutral' size='xs' />
    <Spinner title='Henter kaffi' color='neutral' size='sm' />
    <Spinner title='Henter kaffi' color='neutral' size='md' />
    <Spinner title='Henter kaffi' color='neutral' size='lg' />
    <Spinner title='Henter kaffi' color='neutral' size='xl' />
  </>
);
