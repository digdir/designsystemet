import { LinkIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { DropdownMenu } from '.';
import { Button } from '../Button';

export default {
  title: 'Komponenter/DropdownMenu',
  component: DropdownMenu,
} as Meta;

export const Preview: StoryFn<typeof DropdownMenu> = (args) => {
  return (
    <>
      <DropdownMenu.Context>
        <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
        <DropdownMenu {...args}>
          <DropdownMenu.Heading>Heading 1</DropdownMenu.Heading>
          <DropdownMenu.List>
            <DropdownMenu.Item>Button 1.1</DropdownMenu.Item>
            <DropdownMenu.Item>Button 1.2</DropdownMenu.Item>
          </DropdownMenu.List>
          <DropdownMenu.Heading>Heading 2</DropdownMenu.Heading>
          <DropdownMenu.List>
            <DropdownMenu.Item>Button 2.1</DropdownMenu.Item>
            <DropdownMenu.Item>Button 2.2</DropdownMenu.Item>
          </DropdownMenu.List>
        </DropdownMenu>
      </DropdownMenu.Context>
    </>
  );
};

Preview.args = {
  placement: 'bottom-end',
  size: 'md',
};

export const Icons: StoryFn<typeof DropdownMenu> = (args) => {
  return (
    <DropdownMenu.Context>
      <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
      <DropdownMenu {...args}>
        <DropdownMenu.List>
          <DropdownMenu.Item asChild>
            <a
              href='https://github.com/digdir/designsystemet'
              target='_blank'
              rel='noreferrer'
            >
              <LinkIcon fontSize='1.5rem' />
              Github
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <a
              href='https://designsystemet.no'
              target='_blank'
              rel='noreferrer'
            >
              <LinkIcon fontSize='1.5rem' />
              Designsystemet.no
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.List>
      </DropdownMenu>
    </DropdownMenu.Context>
  );
};

export const Controlled: StoryFn<typeof DropdownMenu> = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu.Context>
        <DropdownMenu.Trigger onClick={() => setOpen(!open)}>
          Dropdown
        </DropdownMenu.Trigger>
        <DropdownMenu open={open} onClose={() => setOpen(false)}>
          <DropdownMenu.List>
            <DropdownMenu.Item asChild>
              <a
                href='https://github.com/digdir/designsystemet'
                target='_blank'
                rel='noreferrer'
              >
                <LinkIcon fontSize='1.5rem' />
                Github
              </a>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <a
                href='https://designsystemet.no'
                target='_blank'
                rel='noreferrer'
              >
                <LinkIcon fontSize='1.5rem' />
                Designsystemet.no
              </a>
            </DropdownMenu.Item>
          </DropdownMenu.List>
        </DropdownMenu>
      </DropdownMenu.Context>
    </>
  );
};

export const WithoutTrigger: StoryFn<typeof DropdownMenu> = () => {
  return (
    <>
      <Button popovertarget='dropdown'>Dropdown</Button>
      <DropdownMenu id='dropdown'>
        <DropdownMenu.List>
          <DropdownMenu.Item>Item</DropdownMenu.Item>
        </DropdownMenu.List>
      </DropdownMenu>
    </>
  );
};
