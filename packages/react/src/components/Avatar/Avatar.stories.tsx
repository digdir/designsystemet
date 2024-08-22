import type { Meta, StoryFn } from '@storybook/react';

import { Avatar } from '.';

type Story = StoryFn<typeof Avatar>;

const meta: Meta = {
  title: 'Komponenter/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Preview: Story = (args) => <Avatar {...args} />;

Preview.args = {
  name: 'Ola Nordmann',
  color: 'accent-strong',
  size: 'md',
};

export const NoName: Story = () => <Avatar />;

export const Sizes: Story = () => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--ds-spacing-2)',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Avatar size='xs' />
    <Avatar size='sm' />
    <Avatar size='md' />
    <Avatar size='lg' />
  </div>
);

export const Variants: Story = () => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--ds-spacing-2)',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Avatar color='accent-subtle' />
    <Avatar color='accent-strong' />
    <Avatar color='brand1-subtle' />
    <Avatar color='brand1-strong' />
    <Avatar color='brand2-subtle' />
    <Avatar color='brand2-strong' />
    <Avatar color='brand3-subtle' />
    <Avatar color='brand3-strong' />
  </div>
);
