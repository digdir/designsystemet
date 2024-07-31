import type { Meta, StoryFn } from '@storybook/react';
import { useState, useEffect } from 'react';

import { Button, Paragraph } from '../..';

import { Popover } from '.';

const marginDecorator = (Story: StoryFn) => (
  <div style={{ margin: '10rem' }}>
    <Story />
  </div>
);

export default {
  title: 'Komponenter/Popover',
  component: Popover.Root,
} as Meta;

export const Preview: StoryFn<typeof Popover.Root> = (args) => {
  return (
    <Popover.Root {...args}>
      <Popover.Trigger>My trigger!</Popover.Trigger>
      <Popover.Content>popover content</Popover.Content>
    </Popover.Root>
  );
};

Preview.args = {
  placement: 'top',
  variant: 'default',
  size: 'md',
  onOpenChange: () => {},
};

Preview.decorators = [marginDecorator];

export const Variants: StoryFn<typeof Popover.Root> = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <div style={{ display: 'flex', gap: 'var(--ds-spacing-2)' }}>
      <Popover.Root open={open} placement='top'>
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover.Content>default</Popover.Content>
      </Popover.Root>
      <Popover.Root open={open} placement='bottom' variant='danger'>
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover.Content>danger</Popover.Content>
      </Popover.Root>
      <Popover.Root open={open} placement='top' variant='info'>
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover.Content>info</Popover.Content>
      </Popover.Root>
      <Popover.Root open={open} placement='bottom' variant='warning'>
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover.Content>warning</Popover.Content>
      </Popover.Root>
    </div>
  );
};

Variants.decorators = [marginDecorator];

export const Controlled: StoryFn<typeof Popover> = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover.Root open={open} onClose={() => setOpen(false)}>
        <Popover.Trigger onClick={() => setOpen(!open)}>
          My trigger
        </Popover.Trigger>
        <Popover.Content>
          <Paragraph>Er du sikker på at du vil slette?</Paragraph>
          <Button
            size='sm'
            color='danger'
            onClick={() => setOpen(false)}
            style={{
              marginTop: 'var(--ds-spacing-2)',
            }}
          >
            Slett
          </Button>
        </Popover.Content>
      </Popover.Root>
    </>
  );
};

Controlled.decorators = [marginDecorator];

export const InPortal = () => {
  return (
    <Popover.Root portal>
      <Popover.Trigger>My trigger</Popover.Trigger>
      <Popover.Content>popover content</Popover.Content>
    </Popover.Root>
  );
};
