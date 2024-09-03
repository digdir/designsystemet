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
    <>
      <Button popovertarget={args.id}>My trigger!</Button>
      <Popover {...args}>popover content</Popover>
    </>
  );
};

Preview.args = {
  id: 'my-popover',
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
      <Button popovertarget='my-popover-1'>popover</Button>
      <Popover id='my-popover-1' open={open} placement='top'>
        default
      </Popover>
      <Button popovertarget='my-popover-2'>popover</Button>
      <Popover
        id='my-popover-2'
        open={open}
        placement='bottom'
        variant='danger'
      >
        danger
      </Popover>
      <Button popovertarget='my-popover-3'>popover</Button>
      <Popover id='my-popover-3' open={open} placement='top' variant='info'>
        info
      </Popover>
      <Button popovertarget='my-popover-4'>popover</Button>
      <Popover
        id='my-popover-4'
        open={open}
        placement='bottom'
        variant='warning'
      >
        warning
      </Popover>
    </div>
  );
};

Variants.decorators = [marginDecorator];

export const Controlled: StoryFn<typeof Popover> = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button popovertarget='my-controlled' onClick={() => setOpen(!open)}>
        My trigger
      </Button>
      <Popover id='my-controlled' open={open} onClose={() => setOpen(false)}>
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

Controlled.decorators = [marginDecorator];
//  onToggle={() => setOpen(!open)}
