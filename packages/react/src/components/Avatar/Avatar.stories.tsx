import type { Meta, StoryFn } from '@storybook/react';

import { BriefcaseIcon } from '@navikt/aksel-icons';
import { Avatar } from '.';
import { Badge, DropdownMenu } from '../';

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
  variant: 'circle',
};

export const NoName: Story = () => <Avatar />;

export const Sizes: Story = () => (
  <>
    <Avatar size='xs' name='x s' />
    <Avatar size='xs' />
    <Avatar size='sm' name='s m' />
    <Avatar size='sm' />
    <Avatar size='md' name='m d' />
    <Avatar size='md' />
    <Avatar size='lg' name='l g' />
    <Avatar size='lg' />
  </>
);

export const ColorVariants: Story = () => (
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

export const ShapeVariants: Story = () => (
  <>
    <Avatar variant='circle' />
    <Avatar variant='square' />
    <Avatar variant='circle' name='Kristoffer Kristoffersen' />
    <Avatar variant='square' name='Kristoffer Kristoffersen' />
  </>
);

export const WithImage: Story = () => (
  <Avatar name='Ola Nordmann'>
    <img src='https://picsum.photos/200' alt='ola nordmann' />
  </Avatar>
);

export const InDropdownMenu: Story = () => (
  <DropdownMenu.Root placement='bottom-end' size='md' portal>
    <DropdownMenu.Trigger variant='tertiary'>
      <Avatar name='Ola Nordmann' size='sm' />
      Velg Profil
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group heading='Alle kontoer'>
        <DropdownMenu.Item>
          <Badge overlap='circle' color='danger' size='sm'>
            <Avatar name='Ola Nordmann' size='xs' />
          </Badge>
          Ola Nordmann
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Avatar size='xs' color='brand1-strong'>
            <BriefcaseIcon fontSize='1.4em' />
          </Avatar>
          Sogndal kommune
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);
