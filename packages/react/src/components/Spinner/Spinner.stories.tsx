import type { Meta, StoryFn } from '@storybook/react';

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
  variant: 'default',
};

export const Variants: Story = () => (
  <>
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='xl'
    />
    <Spinner
      title='Henter kaffi'
      variant='interaction'
      size='xl'
    />
    <div
      style={{
        background: 'var(--ds-semantic-surface-neutral-inverted)',
      }}
    >
      <Spinner
        title='Henter kaffi'
        variant='inverted'
        size='xl'
      />
    </div>
  </>
);

export const Sizes: Story = () => (
  <>
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='2xs'
    />
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='xs'
    />
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='sm'
    />
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='md'
    />
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='lg'
    />
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='xl'
    />
  </>
);
