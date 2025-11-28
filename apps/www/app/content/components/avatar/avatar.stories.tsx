import {
  Avatar,
  type AvatarProps,
  Badge,
  Dropdown,
} from '@digdir/designsystemet-react';
import { BriefcaseIcon } from '@navikt/aksel-icons';

export const Preview = () => (
  <Avatar aria-label='Ola Nordmann' variant='circle' />
);

export const NoName = () => {
  return <Avatar aria-label='Ola' />;
};

export const Sizes = () => (
  <>
    <Avatar data-size='xs' aria-label='extra small' initials='xs' />
    <Avatar data-size='sm' aria-label='small' initials='sm' />
    <Avatar data-size='md' aria-label='medium' initials='md' />
    <Avatar data-size='lg' aria-label='large' initials='lg' />
  </>
);

export const ColorVariants = () => {
  const colors = ['neutral', 'accent', 'brand1', 'brand2', 'nramd3'];

  return (
    <>
      {colors.map((color) => (
        <Avatar
          key={color}
          data-color={color as AvatarProps['data-color']}
          aria-label={`color ${color}`}
        />
      ))}
    </>
  );
};

export const ShapeVariants = () => (
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

export const WithImageAndIcon = () => (
  <>
    <Avatar aria-label='Ola Nordman'>
      <img src='/img/component-docs/cats/cat1.webp' alt='' />
    </Avatar>
    <Avatar aria-label='Ola Nordman'>
      <BriefcaseIcon />
    </Avatar>
  </>
);

export const InDropdown = () => (
  <Dropdown.TriggerContext>
    <Dropdown.Trigger variant='tertiary'>
      <Avatar aria-hidden='true' data-size='sm'>
        ON
      </Avatar>
      Velg Profil
    </Dropdown.Trigger>
    <Dropdown placement='bottom-end' autoPlacement={false} data-size='md'>
      <Dropdown.List>
        <Dropdown.Item>
          <Dropdown.Button>
            <Badge.Position overlap='circle'>
              <Badge data-color='danger' data-size='sm'></Badge>
              <Avatar aria-hidden='true' data-size='xs'>
                ON
              </Avatar>
            </Badge.Position>
            Ola Nordmann
          </Dropdown.Button>
        </Dropdown.Item>
        <Dropdown.Item>
          <Dropdown.Button>
            <Avatar aria-hidden='true' data-size='xs'>
              <BriefcaseIcon />
            </Avatar>
            Sogndal kommune
          </Dropdown.Button>
        </Dropdown.Item>
      </Dropdown.List>
    </Dropdown>
  </Dropdown.TriggerContext>
);
