import type { Meta, StoryFn } from '@storybook/react';
import { useState, useRef, useEffect } from 'react';

import { Button, Paragraph } from '../..';

import { Popover } from '.';

const marginDecorator = (Story: StoryFn) => (
  <div style={{ margin: '10rem' }}>
    <Story />
  </div>
);

export default {
  title: 'Komponenter/Popover',
  component: Popover,
} as Meta;

export const Preview: StoryFn<typeof Popover> = (args) => {
  return (
    <Popover {...args}>
      <Popover.Trigger>My trigger!</Popover.Trigger>
      <Popover.Content>popover content</Popover.Content>
    </Popover>
  );
};

Preview.args = {
  placement: 'top',
  variant: 'default',
  size: 'medium',
  onOpenChange: () => {},
};

Preview.decorators = [marginDecorator];

export const Variants: StoryFn<typeof Popover> = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <div style={{ display: 'flex', gap: 'var(--fds-spacing-2)' }}>
      <Popover
        open={open}
        placement='top'
      >
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover.Content>default</Popover.Content>
      </Popover>
      <Popover
        open={open}
        placement='bottom'
        variant='danger'
      >
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover.Content>danger</Popover.Content>
      </Popover>
      <Popover
        open={open}
        placement='top'
        variant='info'
      >
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover.Content>info</Popover.Content>
      </Popover>
      <Popover
        open={open}
        placement='bottom'
        variant='warning'
      >
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover.Content>warning</Popover.Content>
      </Popover>
    </div>
  );
};

Variants.decorators = [marginDecorator];

export const Controlled: StoryFn<typeof Popover> = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
      >
        <Popover.Trigger onClick={() => setOpen(!open)}>
          My trigger
        </Popover.Trigger>
        <Popover.Content>
          <Paragraph>Er du sikker på at du vil slette?</Paragraph>
          <Button
            size='small'
            color='danger'
            onClick={() => setOpen(false)}
            style={{
              marginTop: 'var(--fds-spacing-2)',
            }}
          >
            Slett
          </Button>
        </Popover.Content>
      </Popover>
    </>
  );
};

Controlled.decorators = [marginDecorator];

export const InPortal = () => {
  return (
    <Popover portal>
      <Popover.Trigger>My trigger</Popover.Trigger>
      <Popover.Content>popover content</Popover.Content>
    </Popover>
  );
};

export const AnchorEl = () => {
  const anchorEl = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        ref={anchorEl}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        My trigger
      </Button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl.current}
      >
        <Popover.Content>popover content</Popover.Content>
      </Popover>
    </>
  );
};

AnchorEl.decorators = [marginDecorator];
