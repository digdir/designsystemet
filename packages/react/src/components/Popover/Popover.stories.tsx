import type { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';

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
    <Popover.Context>
      <Popover.Trigger>My trigger!</Popover.Trigger>
      <Popover {...args}>popover content</Popover>
    </Popover.Context>
  );
};

Preview.args = {
  placement: 'top',
  size: 'md',
  variant: 'default',
};

Preview.decorators = [marginDecorator];

export const Variants: StoryFn<typeof Popover> = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(true), []);

  return (
    <div style={{ display: 'flex', gap: 'var(--ds-spacing-2)' }}>
      <Popover.Context>
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover open={open} placement='top'>
          default
        </Popover>
      </Popover.Context>
      <Popover.Context>
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover open={open} placement='bottom' variant='danger'>
          danger
        </Popover>
      </Popover.Context>
      <Popover.Context>
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover open={open} placement='top' variant='info'>
          info
        </Popover>
      </Popover.Context>
      <Popover.Context>
        <Popover.Trigger>popover</Popover.Trigger>
        <Popover open={open} placement='bottom' variant='warning'>
          warning
        </Popover>
      </Popover.Context>
    </div>
  );
};

Variants.decorators = [marginDecorator];

export const Controlled: StoryFn<typeof Popover> = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Context>
      <Popover.Trigger onClick={() => setOpen(!open)}>
        My trigger
      </Popover.Trigger>
      <Popover open={open} onClose={() => setOpen(false)}>
        <Paragraph>Er du sikker på at du vil slette?</Paragraph>
        <Button
          color='danger'
          onClick={() => setOpen(false)}
          size='sm'
          style={{ marginTop: 'var(--ds-spacing-2)' }}
        >
          Slett
        </Button>
      </Popover>
    </Popover.Context>
  );
};

Controlled.decorators = [marginDecorator];

export const WithoutContext: StoryFn<typeof Popover> = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button popovertarget='my-popover' onClick={() => setOpen(!open)}>
        My trigger
      </Button>
      <Popover id='my-popover' open={open} onClose={() => setOpen(false)}>
        <Paragraph>Er du sikker på at du vil slette?</Paragraph>
        <Button
          color='danger'
          onClick={() => setOpen(false)}
          size='sm'
          style={{ marginTop: 'var(--ds-spacing-2)' }}
        >
          Slett
        </Button>
      </Popover>
    </>
  );
};
