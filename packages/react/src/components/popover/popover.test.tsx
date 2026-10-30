import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { Button } from '../';
import { Dialog } from '../dialog';
import { Popover } from './';

const CompControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(!open)}>
        Dropdown
        {open ? <ChevronDownIcon aria-hidden /> : <ChevronUpIcon aria-hidden />}
      </Button>
      <Popover open={open} onClose={() => setOpen(false)}>
        Content
      </Popover>
    </>
  );
};

type ControlledWithButtonProps = {
  isInitiallyOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

const CompControlledWithButton = (props: ControlledWithButtonProps) => {
  const [open, setOpen] = useState(props.isInitiallyOpen);

  return (
    <>
      <Button popovertarget='popover-controlled'>Dropdown</Button>
      <Popover
        id='popover-controlled'
        open={open}
        onOpen={() => {
          props.onOpen?.();
          setOpen(true);
        }}
        onClose={() => {
          props.onClose?.();
          setOpen(false);
        }}
      >
        {contentText}
      </Popover>
    </>
  );
};

const contentText = 'popover content';
const defaultPopover = (
  <>
    <Button popovertarget='popover'>trigger</Button>
    <Popover id='popover'>{contentText}</Popover>
  </>
);

describe('Popover', () => {
  it('should render popover on trigger-click when closed', async () => {
    render(defaultPopover);
    const popoverTrigger = screen.getByRole('button');

    expect(screen.getByText(contentText)).not.toBeVisible();

    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();
  });

  it('should close when we click the button twice', async () => {
    render(defaultPopover);
    const popoverTrigger = screen.getByRole('button');

    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).not.toBeVisible();
  });

  it('should close when we click outside', async () => {
    render(defaultPopover);

    const popoverTrigger = screen.getByRole('button');

    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    await act(async () => document.body.click());
    expect(screen.getByText(contentText)).not.toBeVisible();
  });

  it('should close when we press ESC', async () => {
    render(defaultPopover);

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    await act(async () => popoverTrigger.dispatchEvent(esc));
    expect(screen.getByText(contentText)).not.toBeVisible();
  });

  it('should not close on ESC when a Dialog is open above the popover', async () => {
    const onClose = vi.fn();
    render(
      <>
        <Button popovertarget='popover'>popover trigger</Button>
        <Popover id='popover' onClose={onClose}>
          {contentText}
          <Button command='show-modal' commandfor='dialog'>
            dialog trigger
          </Button>
        </Popover>
        <Dialog
          id='dialog'
          closeButton={false}
          style={{ inset: 0, width: '100vw', height: '100vh', margin: 0 }}
          aria-label='covering dialog'
        >
          dialog content
        </Dialog>
      </>,
    );

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());

    const dialogTrigger = screen.getByRole('button', {
      name: 'dialog trigger',
    });
    await act(async () => dialogTrigger.click());

    expect(screen.getByText(contentText)).toBeVisible();
    expect(screen.getByRole('dialog')).toBeVisible();

    const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    await act(async () => document.body.dispatchEvent(esc));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText(contentText)).toBeVisible();

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('dialog content')).not.toBeVisible();
  });

  it('should close when we press SPACE', async () => {
    render(defaultPopover);

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    popoverTrigger.focus();
    await userEvent.keyboard('[Space]');
    await vi.waitFor(() =>
      expect(screen.getByText(contentText)).not.toBeVisible(),
    ); // Wait for Popover API
  });

  it('should close when we press ENTER', async () => {
    render(defaultPopover);

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    popoverTrigger.focus();
    await userEvent.keyboard('{Enter}');
    await vi.waitFor(() =>
      expect(screen.getByText(contentText)).not.toBeVisible(),
    ); // Wait for Popover API
  });

  it('should not close if we click inside the popover', async () => {
    render(defaultPopover);

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    await act(async () => screen.getByText(contentText).click());
    expect(screen.getByText(contentText)).toBeVisible();
  });

  /* Deprecated, remove with TriggerContext in the next major version */
  it('should connect Trigger and Popover with TriggerContext', async () => {
    render(
      <Popover.TriggerContext>
        <Popover.Trigger>trigger</Popover.Trigger>
        <Popover>{contentText}</Popover>
      </Popover.TriggerContext>,
    );
    const trigger = screen.getByRole('button');
    const popover = screen.getByText(contentText);

    expect(trigger.getAttribute('popovertarget')).toBe(popover.id);

    await act(async () => trigger.click());
    expect(popover).toBeVisible();
  });

  it('should be able to change content inside Popover trigger element but still toggle when controlled', async () => {
    const { container } = render(<CompControlled />);
    const content = screen.getByText('Content');
    const click = (el?: Element | null) =>
      el?.dispatchEvent(new MouseEvent('click', { bubbles: true })); // Using dispatchEvent to support trigger on SVGElement

    expect(content).not.toBeVisible();

    await act(async () => click(container.querySelector('svg')));
    expect(content).toBeVisible();

    await act(async () => click(container.querySelector('svg')));
    expect(content).not.toBeVisible();
    await act(async () => click(container.querySelector('svg')));
    expect(content).toBeVisible();
  });

  it('should not call onClose when the popover is closed', async () => {
    const onClose = vi.fn();
    render(
      <>
        <Button popovertarget='popover'>trigger</Button>
        <Popover id='popover' onClose={onClose}>
          {contentText}
        </Popover>
      </>,
    );

    const popoverTrigger = screen.getByRole('button');
    await act(async () => document.body.click());
    expect(onClose).toHaveBeenCalledTimes(0);

    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    await act(async () => document.body.click());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onOpen when the popover is open', async () => {
    const onOpen = vi.fn();
    render(
      <>
        <Button popovertarget='popover'>trigger</Button>
        <Popover id='popover' onOpen={onOpen}>
          {contentText}
        </Popover>
      </>,
    );

    const popoverTrigger = screen.getByRole('button');
    await act(async () => document.body.click());
    expect(onOpen).toHaveBeenCalledTimes(0);

    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();
    expect(onOpen).toHaveBeenCalledTimes(1);

    await act(async () => popoverTrigger.click());
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  describe('with controlled state', () => {
    it('should not call onClose when the popover is closed', async () => {
      const onClose = vi.fn();
      render(
        <CompControlledWithButton isInitiallyOpen={false} onClose={onClose} />,
      );
      const popoverTrigger = screen.getByRole('button');

      await act(async () => popoverTrigger.click());
      expect(onClose).toHaveBeenCalledTimes(0);
      await act(async () => popoverTrigger.click());
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onOpen when the popover is open', async () => {
      const onOpen = vi.fn();
      render(<CompControlledWithButton isInitiallyOpen onOpen={onOpen} />);
      const popoverTrigger = screen.getByRole('button');
      expect(screen.getByText(contentText)).toBeVisible();

      await act(async () => popoverTrigger.click());
      expect(onOpen).toHaveBeenCalledTimes(0);
    });
  });
});
