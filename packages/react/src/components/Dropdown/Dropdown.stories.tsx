import { LinkIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Dropdown } from '.';
import { Button } from '../Button';

export default {
  title: 'Komponenter/Dropdown',
  component: Dropdown,
} as Meta;

export const Preview: StoryFn<typeof Dropdown> = (args) => {
  return (
    <Dropdown.Context>
      <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
      <Dropdown {...args}>
        <Dropdown.Heading>Heading 1</Dropdown.Heading>
        <Dropdown.List>
          <Dropdown.Item>Button 1.1</Dropdown.Item>
          <Dropdown.Item>Button 1.2</Dropdown.Item>
        </Dropdown.List>
        <Dropdown.Heading>Heading 2</Dropdown.Heading>
        <Dropdown.List>
          <Dropdown.Item>Button 2.1</Dropdown.Item>
          <Dropdown.Item>Button 2.2</Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </Dropdown.Context>
  );
};

Preview.args = {
  placement: 'bottom-end',
  size: 'md',
};

export const Icons: StoryFn<typeof Dropdown> = (args) => {
  return (
    <Dropdown.Context>
      <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
      <Dropdown {...args}>
        <Dropdown.List>
          <Dropdown.Item asChild>
            <a
              href='https://github.com/digdir/designsystemet'
              target='_blank'
              rel='noreferrer'
            >
              <LinkIcon fontSize='1.5rem' />
              Github
            </a>
          </Dropdown.Item>
          <Dropdown.Item asChild>
            <a
              href='https://designsystemet.no'
              target='_blank'
              rel='noreferrer'
            >
              <LinkIcon fontSize='1.5rem' />
              Designsystemet.no
            </a>
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </Dropdown.Context>
  );
};

export const Controlled: StoryFn<typeof Dropdown> = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown.Context>
      <Dropdown.Trigger onClick={() => setOpen(!open)}>
        Dropdown
      </Dropdown.Trigger>
      <Dropdown open={open} onClose={() => setOpen(false)}>
        <Dropdown.List>
          <Dropdown.Item asChild>
            <a
              href='https://github.com/digdir/designsystemet'
              target='_blank'
              rel='noreferrer'
            >
              <LinkIcon fontSize='1.5rem' />
              Github
            </a>
          </Dropdown.Item>
          <Dropdown.Item asChild>
            <a
              href='https://designsystemet.no'
              target='_blank'
              rel='noreferrer'
            >
              <LinkIcon fontSize='1.5rem' />
              Designsystemet.no
            </a>
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </Dropdown.Context>
  );
};

export const WithoutTrigger: StoryFn<typeof Dropdown> = () => {
  return (
    <>
      <Button popovertarget='dropdown'>Dropdown</Button>
      <Dropdown id='dropdown'>
        <Dropdown.List>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </>
  );
};
