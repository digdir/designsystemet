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
  size: 'md',
  color: 'neutral',
};

export const Variants: Story = () => (
  <>
    <Spinner aria-label='Henter kaffi' color='neutral' size='xl' />
    <Spinner aria-label='Henter kaffi' color='accent' size='xl' />
  </>
);

export const Sizes: Story = () => (
  <>
    <Spinner aria-label='Henter kaffi' color='neutral' size='2xs' />
    <Spinner aria-label='Henter kaffi' color='neutral' size='xs' />
    <Spinner aria-label='Henter kaffi' color='neutral' size='sm' />
    <Spinner aria-label='Henter kaffi' color='neutral' size='md' />
    <Spinner aria-label='Henter kaffi' color='neutral' size='lg' />
    <Spinner aria-label='Henter kaffi' color='neutral' size='xl' />
  </>
);
