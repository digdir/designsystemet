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
          display: 'flex',
          gap: 'var(--ds-spacing-2)',
          justifyContent: 'center',
          alignItems: 'center',
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
  <>
    <Avatar size='xs' name='x s' />
    <Avatar size='sm' name='s m' />
    <Avatar size='md' name='m d' />
    <Avatar size='lg' name='l g' />
  </>
);

export const Variants: Story = () => (
  <>
    <Avatar color='accent-subtle' />
    <Avatar color='accent-strong' />
    <Avatar color='neutral-subtle' />
    <Avatar color='neutral-strong' />
    <Avatar color='brand1-subtle' />
    <Avatar color='brand1-strong' />
    <Avatar color='brand2-subtle' />
    <Avatar color='brand2-strong' />
    <Avatar color='brand3-subtle' />
    <Avatar color='brand3-strong' />
  </>
);
