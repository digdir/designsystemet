import type { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';

import { Button } from '../..';

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
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        ref={(ref) => setButtonRef(ref)}
        onClick={() => setOpen(!open)}
      >
        My trigger
      </Button>
      <Popover
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={buttonRef}
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
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <Button ref={(ref) => setButtonRef(ref)}>My trigger</Button>
      <Popover
        anchorEl={buttonRef}
        open
        variant='danger'
        className='iuoergeriugheriugehugi'
      >
        <Popover.Content className='owrigeorigeorigjeroig'>
          Alt for mye tekst som ligger i en hjelpetekst som er av vår advarsel
          variant. Alt for mye tekst som ligger i en hjelpetekst som er av vår
          advarsel variant. Alt for mye tekst som ligger i en hjelpetekst som er
          av vår advarsel variant.
        </Popover.Content>
      </Popover>
    </>
  );
};
