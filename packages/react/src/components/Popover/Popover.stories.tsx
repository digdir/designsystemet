import type { Meta, StoryFn } from '@storybook/react';
import React, { useRef, useState } from 'react';

import { Button, Paragraph } from '../..';

import { Popover } from '.';

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '10rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Felles/Popover',
  component: Popover,
  decorators,
} as Meta;

export const Preview: StoryFn<typeof Popover> = (args) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
      >
        My trigger
      </Button>
      <Popover
        {...args}
        open={open || args.open}
        onClose={() => setOpen(false)}
        anchorEl={buttonRef.current}
      >
        <Popover.Content>popover content</Popover.Content>
      </Popover>
    </>
  );
};

Preview.args = {
  placement: 'top',
  variant: 'default',
  open: false,
};

export const Variants: StoryFn<typeof Popover> = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
      >
        My trigger
      </Button>
      <Popover
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
        placement='top'
      >
        <Popover.Content>default</Popover.Content>
      </Popover>
      <Popover
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
        placement='right'
        variant='danger'
      >
        <Popover.Content>danger</Popover.Content>
      </Popover>
      <Popover
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
        placement='bottom'
        variant='info'
      >
        <Popover.Content>info</Popover.Content>
      </Popover>
      <Popover
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
        placement='left'
        variant='warning'
      >
        <Popover.Content>warning</Popover.Content>
      </Popover>
    </>
  );
};

export const InteractiveContent: StoryFn<typeof Popover> = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
      >
        My trigger
      </Button>
      <Popover
        anchorEl={buttonRef.current}
        placement='top'
        open={open}
        onClose={() => setOpen(false)}
      >
        <Popover.Content>
          <Paragraph>Er du sikker på at du vil slette?</Paragraph>
          <Button
            size='small'
            color='danger'
            onClick={() => setOpen(false)}
          >
            Slett
          </Button>
        </Popover.Content>
      </Popover>
    </>
  );
};
