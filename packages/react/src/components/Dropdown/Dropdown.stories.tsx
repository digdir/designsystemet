import { LinkIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { Dropdown } from '.';
import { Button } from '../Button';

export default {
  title: 'Komponenter/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'fullscreen',
    customStyles: {
      display: 'grid',
      alignItems: 'start',
      justifyItems: 'center',
      story: {
        boxSizing: 'border-box',
        width: '100cqw',
        height: '100cqh',
        maxWidth: '800px',
        maxHeight: '800px',
      },
    },
  },
  play: async (ctx) => {
    // When not in Docs mode, automatically open the dropdown
    const button = within(ctx.canvasElement).getByRole('button');
    await userEvent.click(button);
    const dropdown = ctx.canvasElement.querySelector('[popover]');
    await expect(dropdown).toBeVisible();
  },
} satisfies Meta;

export const Preview: StoryFn<typeof Dropdown> = (args) => {
  return (
    <Dropdown.Context>
      <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
      <Dropdown {...args}>
        <Dropdown.Heading>First heading</Dropdown.Heading>
        <Dropdown.List>
          <Dropdown.Item>Button 1.1</Dropdown.Item>
          <Dropdown.Item>Button 1.2</Dropdown.Item>
        </Dropdown.List>
        <Dropdown.Heading>Second heading</Dropdown.Heading>
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
  'data-size': 'md',
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
              <LinkIcon aria-hidden fontSize='1.5rem' />
              Github
            </a>
          </Dropdown.Item>
          <Dropdown.Item asChild>
            <a
              href='https://designsystemet.no'
              target='_blank'
              rel='noreferrer'
            >
              <LinkIcon aria-hidden fontSize='1.5rem' />
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
              <LinkIcon aria-hidden fontSize='1.5rem' />
              Github
            </a>
          </Dropdown.Item>
          <Dropdown.Item asChild>
            <a
              href='https://designsystemet.no'
              target='_blank'
              rel='noreferrer'
            >
              <LinkIcon aria-hidden fontSize='1.5rem' />
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
