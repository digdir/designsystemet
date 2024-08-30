import cat1 from '@assets/img/cats/Cat 3.jpg';
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
  'aria-label': 'Ola Nordmann',
  color: 'accent',
  size: 'md',
  variant: 'circle',
  children: '',
};

export const NoName: Story = () => <Avatar aria-label='Ola' />;

export const Sizes: Story = () => (
  <>
    <Avatar size='xs' aria-label='x s'>
      xs
    </Avatar>
    <Avatar size='xs' aria-label='' />
    <Avatar size='sm' aria-label='s m'>
      sm
    </Avatar>
    <Avatar size='sm' aria-label='' />
    <Avatar size='md' aria-label='m d'>
      md
    </Avatar>
    <Avatar size='md' aria-label='' />
    <Avatar size='lg' aria-label='l g'>
      lg
    </Avatar>
    <Avatar size='lg' aria-label='' />
  </>
);

export const ColorVariants: Story = () => (
  <>
    <Avatar color='accent' aria-label='' />
    <Avatar color='neutral' aria-label='' />
    <Avatar color='brand1' aria-label='' />
    <Avatar color='brand2' aria-label='' />
    <Avatar color='brand3' aria-label='' />
  </>
);

export const ShapeVariants: Story = () => (
  <>
    <Avatar variant='circle' aria-label='' />
    <Avatar variant='square' aria-label='' />
    <Avatar variant='circle' aria-label='Kristoffer Kristoffersen'>
      kk
    </Avatar>
    <Avatar variant='square' aria-label='Kristoffer Kristoffersen'>
      kk
    </Avatar>
  </>
);

export const WithImage: Story = (args) => (
  <Avatar {...args}>
    <img src={cat1} alt='Ola Nordmann' />
  </Avatar>
);

export const InDropdownMenu: Story = () => (
  <DropdownMenu.Root placement='bottom-end' size='md' portal>
    <DropdownMenu.Trigger variant='tertiary'>
      <Avatar aria-label='Ola Nordmann' size='sm'>
        ON
      </Avatar>
      Velg Profil
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group heading='Alle kontoer'>
        <DropdownMenu.Item>
          <Badge overlap='circle' color='danger' size='sm'>
            <Avatar aria-label='Ola Nordmann' size='xs'>
              ON
            </Avatar>
          </Badge>
          Ola Nordmann
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Avatar size='xs' color='brand1' aria-label='Sogndal Kommune'>
            <BriefcaseIcon fontSize='5em' />
          </Avatar>
          Sogndal kommune
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

export const AsLink: Story = () => (
  <a href='#'>
    <Avatar aria-label='Ola Nordmann' />
  </a>
);
