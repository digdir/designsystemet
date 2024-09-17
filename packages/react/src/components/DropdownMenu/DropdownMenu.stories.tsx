import { LinkIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { DropdownMenu } from '.';

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
          <DropdownMenu.Group heading='Heading 2'>
            <DropdownMenu.Item>Button 1.1</DropdownMenu.Item>
            <DropdownMenu.Item>Button 1.2</DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Group heading='Heading 2'>
            <DropdownMenu.Item>Button 2.1</DropdownMenu.Item>
            <DropdownMenu.Item>Button 2.2</DropdownMenu.Item>
          </DropdownMenu.Group>
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
        <DropdownMenu.Group>
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
        </DropdownMenu.Group>
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
          <DropdownMenu.Group>
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
          </DropdownMenu.Group>
        </DropdownMenu>
      </DropdownMenu.Context>
    </>
  );
};
