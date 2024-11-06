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
  'aria-label': 'Henter kaffi',
  'data-size': 'md',
  color: 'neutral',
};

export const Variants: Story = () => (
  <>
    <Spinner aria-label='Henter kaffi' color='neutral' data-size='xl' />
    <Spinner aria-label='Henter kaffi' color='accent' data-size='xl' />
  </>
);

export const Sizes: Story = () => (
  <>
    <Spinner aria-label='Henter kaffi' color='neutral' data-size='2xs' />
    <Spinner aria-label='Henter kaffi' color='neutral' data-size='xs' />
    <Spinner aria-label='Henter kaffi' color='neutral' data-size='sm' />
    <Spinner aria-label='Henter kaffi' color='neutral' data-size='md' />
    <Spinner aria-label='Henter kaffi' color='neutral' data-size='lg' />
    <Spinner aria-label='Henter kaffi' color='neutral' data-size='xl' />
  </>
);
