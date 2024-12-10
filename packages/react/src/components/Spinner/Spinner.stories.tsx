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
};

export const Variants: Story = () => (
  <>
    <Spinner aria-label='Henter kaffi' data-color='neutral' data-size='xl' />
    <Spinner aria-label='Henter kaffi' data-color='accent' data-size='xl' />
    <Spinner aria-label='Henter kaffi' data-color='brand1' data-size='xl' />
  </>
);

export const Sizes: Story = (args) => (
  <>
    <Spinner aria-label='Henter kaffi' {...args} data-size='2xs' />
    <Spinner aria-label='Henter kaffi' {...args} data-size='xs' />
    <Spinner aria-label='Henter kaffi' {...args} data-size='sm' />
    <Spinner aria-label='Henter kaffi' {...args} data-size='md' />
    <Spinner aria-label='Henter kaffi' {...args} data-size='lg' />
    <Spinner aria-label='Henter kaffi' {...args} data-size='xl' />
  </>
);
