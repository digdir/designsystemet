import {
  Avatar,
  type AvatarProps,
  Badge,
  Button,
  Dropdown,
} from '@digdir/designsystemet-react';
import { BriefcaseIcon } from '@navikt/aksel-icons';

export const Preview = () => <Avatar aria-label='Ola Nordmann' />;

export const Initials = () => <Avatar aria-label='Ola Nordmann'>ON</Avatar>;

export const Sizes = () => (
  <>
    <Avatar data-size='xs' aria-label='extra small'>
      xs
    </Avatar>
    <Avatar data-size='sm' aria-label='small'>
      sm
    </Avatar>
    <Avatar data-size='md' aria-label='medium'>
      md
    </Avatar>
    <Avatar data-size='lg' aria-label='large'>
      lg
    </Avatar>
  </>
);

export const ColorVariants = () => {
  const colors = ['neutral', 'accent'];

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

export const Radius = () => (
  <>
    <Avatar aria-label='radius default' />
    <Avatar
      aria-label='radius 1rem'
      style={
        {
          '--dsc-avatar-radius': '1rem',
        } as React.CSSProperties
      }
    />
    <Avatar
      aria-label='radius lg'
      style={
        {
          '--dsc-avatar-radius': 'var(--ds-border-radius-lg)',
        } as React.CSSProperties
      }
    >
      ON
    </Avatar>
    <Avatar
      aria-label='radius none'
      style={
        {
          '--dsc-avatar-radius': 'none',
        } as React.CSSProperties
      }
    >
      ON
    </Avatar>
  </>
);

export const WithImageAndIcon = () => (
  <>
    <Avatar aria-label='Ola Nordmann'>
      <img src='/img/component-docs/cats/cat1.webp' alt='' />
    </Avatar>
    <Avatar aria-label='Ola Nordmann'>
      <BriefcaseIcon />
    </Avatar>
  </>
);

export const InDropdown = () => (
  <>
    <Button popovertarget='dropdown' variant='tertiary'>
      <Avatar aria-hidden='true' data-size='sm'>
        ON
      </Avatar>
      Ola Nordmann
    </Button>
    <Dropdown id='dropdown' placement='bottom-end' autoPlacement={false}>
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
  </>
);
