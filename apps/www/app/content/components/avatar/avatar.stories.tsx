import {
  Avatar,
  type AvatarProps,
  Badge,
  Button,
  Dropdown,
} from '@digdir/designsystemet-react';
import { BriefcaseIcon } from '@navikt/aksel-icons';

export const Preview = () => (
  <Avatar aria-label='Ola Nordmann' variant='circle' />
);

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

export const ShapeVariants = () => (
  <>
    <Avatar aria-label='variant circle' />
    <Avatar
      aria-label='variant square'
      style={
        {
          '--dsc-avatar-radius': 'var(--ds-border-radius-md)',
        } as React.CSSProperties
      }
    />
    <Avatar aria-label='Ola Nordmann'>ON</Avatar>
    <Avatar
      aria-label='Ola Nordmann'
      style={
        {
          '--dsc-avatar-radius': 'var(--ds-border-radius-md)',
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
