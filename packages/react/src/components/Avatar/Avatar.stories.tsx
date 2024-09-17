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
    <Avatar size='xs' aria-label='extra small'>
      xs
    </Avatar>
    <Avatar size='xs' aria-label='extra small' />
    <Avatar size='sm' aria-label='small'>
      sm
    </Avatar>
    <Avatar size='sm' aria-label='small' />
    <Avatar size='md' aria-label='medium'>
      md
    </Avatar>
    <Avatar size='md' aria-label='medium' />
    <Avatar size='lg' aria-label='large'>
      lg
    </Avatar>
    <Avatar size='lg' aria-label='large' />
  </>
);

export const ColorVariants: Story = () => (
  <>
    <Avatar color='accent' aria-label='color accent' />
    <Avatar color='neutral' aria-label='color neutral' />
    <Avatar color='brand1' aria-label='color brand1' />
    <Avatar color='brand2' aria-label='color brand2' />
    <Avatar color='brand3' aria-label='color brand3' />
  </>
);

export const ShapeVariants: Story = () => (
  <>
    <Avatar variant='circle' aria-label='variant circle' />
    <Avatar variant='square' aria-label='variant square' />
    <Avatar variant='circle' aria-label='Ola Nordman'>
      ON
    </Avatar>
    <Avatar variant='square' aria-label='Ola Nordman'>
      ON
    </Avatar>
  </>
);

export const WithImage: Story = () => (
  <Avatar aria-label='Ola Nordman'>
    <img src={cat1} alt='' />
  </Avatar>
);

export const InDropdownMenu: Story = () => (
  <DropdownMenu.Context>
    <DropdownMenu.Trigger variant='tertiary'>
      <Avatar aria-label='Ola Nordmann' size='sm'>
        ON
      </Avatar>
      Velg Profil
    </DropdownMenu.Trigger>
    <DropdownMenu placement='bottom-end' size='md'>
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
    </DropdownMenu>
  </DropdownMenu.Context>
);

export const AsLink: Story = () => (
  <a href='#'>
    <Avatar aria-label='Ola Nordmann' />
  </a>
);
