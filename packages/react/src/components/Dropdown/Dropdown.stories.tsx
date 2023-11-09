import type { StoryFn, Meta } from '@storybook/react';
import React, { useEffect, useRef } from 'react';
import { LinkIcon } from '@navikt/aksel-icons';

import { Button } from '../..';

import { Dropdown } from '.';

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '20rem', marginTop: '0' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Felles/Dropdown',
  component: Dropdown,
  decorators,
} as Meta;

export const Preview: StoryFn<typeof Dropdown> = (args) => {
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
      >
        Dropdown
      </Button>
      <Dropdown
        {...args}
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Dropdown.Section>
          <Dropdown.Header>Links</Dropdown.Header>
          <Dropdown.Item
            as='a'
            href='https://github.com/digdir/designsystem'
            target='_black'
          >
            Github
          </Dropdown.Item>
          <Dropdown.Item
            as='a'
            href='https://designsystemet.no'
            target='_blank'
          >
            Designsystemet.no
          </Dropdown.Item>
        </Dropdown.Section>
        <Dropdown.Divider />
        <Dropdown.Section>
          <Dropdown.Item>Button 1</Dropdown.Item>
          <Dropdown.Item>Button 2</Dropdown.Item>
          <Dropdown.Item disabled>Disabled</Dropdown.Item>
        </Dropdown.Section>
      </Dropdown>
    </>
  );
};

Preview.args = {
  placement: 'bottom-end',
  size: 'medium',
  open: false,
};

export const Icons: StoryFn<typeof Dropdown> = (args) => {
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
      >
        Dropdown
      </Button>
      <Dropdown
        {...args}
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Dropdown.Section>
          <Dropdown.Header>Links</Dropdown.Header>
          <Dropdown.Item
            as='a'
            href='https://github.com/digdir/designsystem'
            target='_black'
            icon={<LinkIcon />}
          >
            Github
          </Dropdown.Item>
          <Dropdown.Item
            as='a'
            href='https://designsystemet.no'
            target='_blank'
            icon={<LinkIcon />}
          >
            Designsystemet.no
          </Dropdown.Item>
        </Dropdown.Section>
      </Dropdown>
    </>
  );
};
