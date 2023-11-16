import type { StoryFn, Meta } from '@storybook/react';
import React, { useEffect, useRef } from 'react';
import { LinkIcon } from '@navikt/aksel-icons';

import { Button, Divider } from '../..';

import { DropdownMenu } from '.';

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '25rem', marginTop: '0' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Felles/DropdownMenu',
  component: DropdownMenu,
  decorators,
} as Meta;

export const Preview: StoryFn<typeof DropdownMenu> = (args) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(args.open || false);
  }, [args.open]);

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup='menu'
      >
        Dropdown
      </Button>
      <DropdownMenu
        {...args}
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DropdownMenu.Group heading='Links'>
          <DropdownMenu.Item
            as='a'
            href='https://github.com/digdir/designsystem'
            target='_blank'
          >
            Github
          </DropdownMenu.Item>
          <DropdownMenu.Item
            as='a'
            href='https://designsystemet.no'
            target='_blank'
          >
            Designsystemet.no
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <Divider />
        <DropdownMenu.Group>
          <DropdownMenu.Item>Button 1</DropdownMenu.Item>
          <DropdownMenu.Item>Button 2</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Disabled</DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu>
    </>
  );
};

Preview.args = {
  placement: 'bottom-end',
  size: 'medium',
  open: false,
};

export const Icons: StoryFn<typeof DropdownMenu> = (args) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(args.open || false);
  }, [args.open]);

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup='menu'
      >
        Dropdown
      </Button>
      <DropdownMenu
        {...args}
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DropdownMenu.Group>
          <DropdownMenu.Item
            as='a'
            href='https://github.com/digdir/designsystem'
            target='_blank'
            icon={<LinkIcon />}
          >
            Github
          </DropdownMenu.Item>
          <DropdownMenu.Item
            as='a'
            href='https://designsystemet.no'
            target='_blank'
            icon={<LinkIcon />}
          >
            Designsystemet.no
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu>
    </>
  );
};
