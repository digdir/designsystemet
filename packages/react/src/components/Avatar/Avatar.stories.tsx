import type { Meta, StoryFn } from '@storybook/react';

import { Avatar } from '.';

type Story = StoryFn<typeof Avatar>;

const meta: Meta = {
  title: 'Komponenter/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Preview: Story = (args) => <Avatar {...args} />;

Preview.args = {
  name: 'Ola Nordmann',
  color: 'accent',
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
    <Avatar color='accent' />
    <Avatar color='brand1' />
    <Avatar color='brand2' />
    <Avatar color='brand3' />
  </div>
);
