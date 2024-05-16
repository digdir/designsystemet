import type { StoryFn, Meta } from '@storybook/react';
import { useState } from 'react';
import { LinkIcon } from '@navikt/aksel-icons';

import { Divider } from '../..';

import { DropdownMenu } from '.';

const marginDecorator = (Story: StoryFn) => (
  <div style={{ margin: '20rem', marginTop: '0' }}>
    <Story />
  </div>
);

export default {
  title: 'Komponenter/DropdownMenu',
  component: DropdownMenu,
} as Meta;

export const Preview: StoryFn<typeof DropdownMenu> = (args) => {
  return (
    <>
      <DropdownMenu {...args}>
        <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group heading='Links'>
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
          <Divider />
          <DropdownMenu.Group>
            <DropdownMenu.Item>Button 1</DropdownMenu.Item>
            <DropdownMenu.Item>Button 2</DropdownMenu.Item>
            <DropdownMenu.Item disabled>Disabled</DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};

Preview.args = {
  placement: 'bottom-end',
  size: 'medium',
};

Preview.decorators = [marginDecorator];

export const Icons: StoryFn<typeof DropdownMenu> = () => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
      <DropdownMenu.Content>
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
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

Icons.decorators = [marginDecorator];

export const InPortal: StoryFn<typeof DropdownMenu> = () => {
  return (
    <DropdownMenu portal>
      <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
      <DropdownMenu.Content>
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
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export const Controlled: StoryFn<typeof DropdownMenu> = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu
        open={open}
        onClose={() => setOpen(false)}
        portal
      >
        <DropdownMenu.Trigger onClick={() => setOpen(!open)}>
          Dropdown
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
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
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};
