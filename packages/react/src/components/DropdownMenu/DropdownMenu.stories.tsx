import type { StoryFn, Meta } from '@storybook/react';
import { useState } from 'react';
import { LinkIcon } from '@navikt/aksel-icons';

import { DropdownMenu } from '.';

const marginDecorator = (Story: StoryFn) => (
  <div style={{ margin: '20rem', marginTop: '0' }}>
    <Story />
  </div>
);

export default {
  title: 'Komponenter/DropdownMenu',
  component: DropdownMenu.Root,
} as Meta;

export const Preview: StoryFn<typeof DropdownMenu.Root> = (args) => {
  return (
    <>
      <DropdownMenu.Root {...args}>
        <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group heading='Heading'>
            <DropdownMenu.Item>Button 1</DropdownMenu.Item>
            <DropdownMenu.Item>Button 2</DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

Preview.args = {
  placement: 'bottom-end',
  size: 'md',
};

Preview.decorators = [marginDecorator];

export const Icons: StoryFn<typeof DropdownMenu.Root> = () => {
  return (
    <DropdownMenu.Root>
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
    </DropdownMenu.Root>
  );
};

Icons.decorators = [marginDecorator];

export const InPortal: StoryFn<typeof DropdownMenu> = () => {
  return (
    <DropdownMenu.Root portal>
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
    </DropdownMenu.Root>
  );
};

export const Controlled: StoryFn<typeof DropdownMenu> = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu.Root open={open} onClose={() => setOpen(false)} portal>
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
      </DropdownMenu.Root>
    </>
  );
};
