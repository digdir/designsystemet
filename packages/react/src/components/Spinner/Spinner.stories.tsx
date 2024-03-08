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
  title: 'Felles/Loaders/Spinner',
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
      size='xlarge'
    />
    <Spinner
      title='Henter kaffi'
      variant='interaction'
      size='xlarge'
    />
    <div
      style={{
        background: 'var(--fds-semantic-surface-neutral-inverted)',
      }}
    >
      <Spinner
        title='Henter kaffi'
        variant='inverted'
        size='xlarge'
      />
    </div>
  </>
);

export const Sizes: Story = () => (
  <>
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='xxsmall'
    />
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='xsmall'
    />
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='small'
    />
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='medium'
    />
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='large'
    />
    <Spinner
      title='Henter kaffi'
      variant='default'
      size='xlarge'
    />
  </>
);
