import { ChevronDownIcon, ChevronUpIcon, LinkIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { Button, Dialog } from '../';
import { Dropdown } from './';

const meta = preview.meta({
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
    chromatic: {
      disableSnapshot: false,
    },
  },
  play: async (ctx) => {
    // When not in Docs mode, automatically open the dropdown
    const button = within(ctx.canvasElement).getByRole('button');
    await new Promise((resolve) => {
      document.addEventListener('animationend', resolve, true); // <== Merk at vi binder event-listener før vi gjør click
      userEvent.click(button);
    });
    const dropdown = ctx.canvasElement.querySelector('.ds-dropdown');
    await expect(dropdown).toBeInTheDocument();
    await waitFor(() => expect(dropdown).toBeVisible());
  },
});

export const Preview = meta.story({
  render: (args) => {
    return (
      <Dropdown.TriggerContext>
        <Dropdown.Trigger data-color={args['data-color']}>
          Dropdown
        </Dropdown.Trigger>
        <Dropdown {...args}>
          <Dropdown.Heading>First heading</Dropdown.Heading>
          <Dropdown.List>
            <Dropdown.Item>
              <Dropdown.Button>Button 1.1</Dropdown.Button>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Button>Button 1.2</Dropdown.Button>
            </Dropdown.Item>
          </Dropdown.List>
          <Dropdown.Heading>Second heading</Dropdown.Heading>
          <Dropdown.List>
            <Dropdown.Item>
              <Dropdown.Button>Button 2.1</Dropdown.Button>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Button>Button 2.2</Dropdown.Button>
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown>
      </Dropdown.TriggerContext>
    );
  },

  args: {
    placement: 'bottom-end',
  },
});

export const Icons = meta.story({
  render: (args) => {
    return (
      <Dropdown.TriggerContext>
        <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
        <Dropdown {...args}>
          <Dropdown.List>
            <Dropdown.Item>
              <Dropdown.Button asChild>
                <a
                  href='https://github.com/digdir/designsystemet'
                  target='_blank'
                  rel='noreferrer'
                >
                  <LinkIcon aria-hidden />
                  GitHub
                </a>
              </Dropdown.Button>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Button asChild>
                <a
                  href='https://designsystemet.no'
                  target='_blank'
                  rel='noreferrer'
                >
                  <LinkIcon aria-hidden />
                  Designsystemet.no
                </a>
              </Dropdown.Button>
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown>
      </Dropdown.TriggerContext>
    );
  },
});

export const Controlled = meta.story(() => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown.TriggerContext>
      <Dropdown.Trigger>
        Dropdown
        {open ? <ChevronDownIcon aria-hidden /> : <ChevronUpIcon aria-hidden />}
      </Dropdown.Trigger>
      <Dropdown
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Dropdown.List>
          <Dropdown.Item>
            <Dropdown.Button onClick={() => setOpen(false)}>
              Trykk på meg lukker
            </Dropdown.Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Button onClick={() => setOpen(false)}>
              Eg lukker også
            </Dropdown.Button>
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </Dropdown.TriggerContext>
  );
});

export const ControlledExternalTrigger = meta.story(() => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button popovertarget='dropdown'>Dropdown</Button>
      <Dropdown
        id='dropdown'
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Dropdown.List>
          <Dropdown.Item>
            <Dropdown.Button>Item</Dropdown.Button>
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </>
  );
});

export const WithoutTrigger = meta.story(() => {
  return (
    <>
      <Button popovertarget='dropdown'>Dropdown</Button>
      <Dropdown id='dropdown'>
        <Dropdown.List>
          <Dropdown.Item>
            <Dropdown.Button>Item</Dropdown.Button>
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </>
  );
});

export const WithNestedDialog = meta.story({
  render: (args) => {
    return (
      <Dropdown.TriggerContext>
        <Dropdown.Trigger data-color={args['data-color']}>
          Dropdown
        </Dropdown.Trigger>
        <Dropdown {...args}>
          <Dropdown.List>
            <Dropdown.Item>
              <Dialog.TriggerContext>
                <Dialog.Trigger asChild>
                  <Dropdown.Button>Dialog</Dropdown.Button>
                </Dialog.Trigger>
                <Dialog>Min dialog</Dialog>
              </Dialog.TriggerContext>
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown>
      </Dropdown.TriggerContext>
    );
  },

  play: async (ctx) => {
    // When not in Docs mode, automatically open the dropdown
    const button = within(ctx.canvasElement).getByRole('button');
    await new Promise((resolve) => {
      document.addEventListener('animationend', resolve, true); // <== Merk at vi binder event-listener før vi gjør click
      userEvent.click(button);
    });
    const dropdown = ctx.canvasElement.querySelector('.ds-dropdown');
    await expect(dropdown).toBeInTheDocument();
    await waitFor(() => expect(dropdown).toBeVisible());

    if (!dropdown) return;

    /* open dialog */
    const dialogButton = within(dropdown as HTMLElement).getByRole('button', {
      name: 'Dialog',
    });
    userEvent.click(dialogButton);
    const dialog = ctx.canvasElement.querySelector('.ds-dialog');
    await expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(dialog).toBeVisible());
  },
});

export const WithAdjacentDialog = meta.story({
  render: (args) => {
    return (
      <>
        <Dropdown.TriggerContext>
          <Dropdown.Trigger data-color={args['data-color']}>
            Dropdown
          </Dropdown.Trigger>
          <Dropdown {...args}>
            <Dropdown.List>
              <Dropdown.Item>
                <Dropdown.Button
                  command='show-modal'
                  commandFor='adjacent-modal'
                >
                  Dialog
                </Dropdown.Button>
              </Dropdown.Item>
            </Dropdown.List>
          </Dropdown>
        </Dropdown.TriggerContext>
        <Dialog id='adjacent-modal'>Min dialog</Dialog>
      </>
    );
  },
});

export const WithNestedDropdown = meta.story({
  render: (args) => {
    return (
      <Dropdown.TriggerContext>
        <Dropdown.Trigger data-color={args['data-color']}>
          Dropdown
        </Dropdown.Trigger>
        <Dropdown {...args}>
          <Dropdown.List>
            <Dropdown.Item>
              <Dropdown.TriggerContext>
                <Dropdown.Trigger variant='tertiary'>Dropdown</Dropdown.Trigger>
                <Dropdown>
                  <Dropdown.List>
                    <Dropdown.Item>
                      <Dropdown.Button>Nested</Dropdown.Button>
                    </Dropdown.Item>
                  </Dropdown.List>
                </Dropdown>
              </Dropdown.TriggerContext>
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown>
      </Dropdown.TriggerContext>
    );
  },
});
