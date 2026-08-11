import { BriefcaseIcon, HeartIcon } from '@navikt/aksel-icons';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { cat3Img, themeColors } from '../../../stories/constants';

import { Avatar, type AvatarProps, Badge, Dropdown } from '../';

const meta = preview.meta({
  title: 'Komponenter/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
    customStyles: {
      display: 'flex',
      gap: 'var(--ds-size-2)',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
  },
});

export const Preview = meta.story({
  args: {
    'aria-label': 'Ola Nordmann',
    variant: 'circle',
    children: '',
  },
});

export const NoName = meta.story(() => <Avatar aria-label='Ola' />);

export const Sizes = meta.story(() => (
  <>
    <Avatar data-size='xs' aria-label='extra small' initials='xs' />
    <Avatar data-size='xs' aria-label='extra small' />
    <Avatar data-size='xs' aria-label='extra small'>
      <HeartIcon aria-hidden />
    </Avatar>
    <Avatar data-size='sm' aria-label='small' initials='sm' />
    <Avatar data-size='sm' aria-label='small' />
    <Avatar data-size='sm' aria-label='small'>
      <HeartIcon aria-hidden />
    </Avatar>
    <Avatar data-size='md' aria-label='medium' initials='md' />
    <Avatar data-size='md' aria-label='medium' />
    <Avatar data-size='md' aria-label='medium'>
      <HeartIcon aria-hidden />
    </Avatar>
    <Avatar data-size='lg' aria-label='large' initials='lg' />
    <Avatar data-size='lg' aria-label='large' />
    <Avatar data-size='lg' aria-label='large'>
      <HeartIcon aria-hidden />
    </Avatar>
  </>
));

export const ColorVariants = meta.story(() => (
  <>
    {[...themeColors].map((color) => (
      <Avatar
        key={color}
        data-color={color as AvatarProps['data-color']}
        aria-label={`color ${color}`}
      />
    ))}
  </>
));

export const ShapeVariants = meta.story(() => (
  <>
    <Avatar variant='circle' aria-label='variant circle' />
    <Avatar variant='square' aria-label='variant square' />
    <Avatar variant='circle' aria-label='Ola Nordmann'>
      ON
    </Avatar>
    <Avatar variant='square' aria-label='Ola Nordmann'>
      ON
    </Avatar>
  </>
));

export const WithImage = meta.story(() => (
  <Avatar aria-label='Ola Nordmann'>{cat3Img}</Avatar>
));

export const InDropdown = meta.story({
  render: () => (
    <Dropdown.TriggerContext>
      <Dropdown.Trigger variant='tertiary'>
        <Avatar aria-label='Ola Nordmann' data-size='sm'>
          ON
        </Avatar>
        Velg Profil
      </Dropdown.Trigger>
      <Dropdown
        placement='bottom-end'
        autoPlacement={false}
        data-size='md'
        open
      >
        <Dropdown.List>
          <Dropdown.Item>
            <Dropdown.Button>
              <Badge.Position overlap='circle'>
                <Badge data-color='danger' data-size='sm'></Badge>
                <Avatar aria-hidden={true} data-size='xs'>
                  ON
                </Avatar>
              </Badge.Position>
              Ola Nordmann
            </Dropdown.Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Button>
              <Avatar aria-hidden data-size='xs'>
                <BriefcaseIcon />
              </Avatar>
              Sogndal kommune
            </Dropdown.Button>
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </Dropdown.TriggerContext>
  ),

  parameters: {
    layout: 'fullscreen',
    customStyles: {
      height: '320px',
    },
  },
});

export const AsLink = meta.story(() => (
  <>
    <Avatar aria-label='xs' data-size='xs' asChild>
      <a href='#none'>
        <HeartIcon aria-hidden />
      </a>
    </Avatar>
    <Avatar aria-label='sm' data-size='sm' asChild>
      <a href='#none'>
        <HeartIcon aria-hidden />
      </a>
    </Avatar>
    <Avatar aria-label='md' data-size='md' asChild>
      <a href='#none'>
        <HeartIcon aria-hidden />
      </a>
    </Avatar>
    <Avatar aria-label='lg' data-size='lg' asChild>
      <a href='#none'>
        <HeartIcon aria-hidden />
      </a>
    </Avatar>
  </>
));

export const AsButton = meta.story(() => (
  <>
    <Avatar aria-label='xs' data-size='xs' asChild>
      <button type='button'>
        <HeartIcon aria-hidden />
      </button>
    </Avatar>
    <Avatar aria-label='sm' data-size='sm' asChild>
      <button type='button'>
        <HeartIcon aria-hidden />
      </button>
    </Avatar>
    <Avatar aria-label='md' data-size='md' asChild>
      <button type='button'>
        <HeartIcon aria-hidden />
      </button>
    </Avatar>
    <Avatar aria-label='lg' data-size='lg' asChild>
      <button type='button'>
        <HeartIcon aria-hidden />
      </button>
    </Avatar>
  </>
));
