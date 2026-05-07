import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { act, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { Button } from '../';
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

type ControlledWithTriggerProps = {
  isInitiallyOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

const CompControlledWithTrigger = (props: ControlledWithTriggerProps) => {
  const [open, setOpen] = useState(props.isInitiallyOpen);

  return (
    <Popover.TriggerContext>
      <Popover.Trigger>Dropdown</Popover.Trigger>
      <Popover
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
    </Popover.TriggerContext>
  );
};

const contentText = 'popover content';
const defaultPopover = (
  <Popover.TriggerContext>
    <Popover.Trigger>trigger</Popover.Trigger>
    <Popover>{contentText}</Popover>
  </Popover.TriggerContext>
);

describe('Popover', () => {
  it('should render popover on trigger-click when closed', async () => {
    render(defaultPopover);
    const popoverTrigger = screen.getByRole('button');

    expect(screen.getByText(contentText)).not.toBeVisible();

    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();
  });

  it('should close when we click the button twitce', async () => {
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

  it('should close when we press SPACE', async () => {
    render(defaultPopover);

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    await act(async () => popoverTrigger.dispatchEvent(space));
    vi.waitFor(() => expect(screen.getByText(contentText)).not.toBeVisible()); // Wait for Popover API
  });

  it('should close when we press ENTER', async () => {
    render(defaultPopover);

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    await act(async () => popoverTrigger.dispatchEvent(enter));
    vi.waitFor(() => expect(screen.getByText(contentText)).not.toBeVisible()); // Wait for Popover API
  });

  it('should not close if we click inside the popover', async () => {
    render(defaultPopover);

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    await act(async () => screen.getByText(contentText).click());
    expect(screen.getByText(contentText)).toBeVisible();
  });

  it('should have correct id and popovertarget attributes', () => {
    render(defaultPopover);
    const trigger = screen.getByRole('button');
    const popover = screen.getByText(contentText);

    expect(trigger.getAttribute('popovertarget')).toBe(popover.id);
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
      <Popover.TriggerContext>
        <Popover.Trigger>trigger</Popover.Trigger>
        <Popover onClose={onClose}>{contentText}</Popover>
      </Popover.TriggerContext>,
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
      <Popover.TriggerContext>
        <Popover.Trigger>trigger</Popover.Trigger>
        <Popover onOpen={onOpen}>{contentText}</Popover>
      </Popover.TriggerContext>,
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
        <CompControlledWithTrigger isInitiallyOpen={false} onClose={onClose} />,
      );
      const popoverTrigger = screen.getByRole('button');

      await act(async () => popoverTrigger.click());
      expect(onClose).toHaveBeenCalledTimes(0);
      await act(async () => popoverTrigger.click());
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onOpen when the popover is open', async () => {
      const onOpen = vi.fn();
      render(<CompControlledWithTrigger isInitiallyOpen onOpen={onOpen} />);
      const popoverTrigger = screen.getByRole('button');
      expect(screen.getByText(contentText)).toBeVisible();

      await act(async () => popoverTrigger.click());
      expect(onOpen).toHaveBeenCalledTimes(0);
    });
  });

  describe('when a dialog is open above the popover', () => {
    it('should not close the popover with Escape when a modal dialog is open', async () => {
      render(
        <>
          <Popover.TriggerContext>
            <Popover.Trigger>trigger</Popover.Trigger>
            <Popover>{contentText}</Popover>
          </Popover.TriggerContext>
          <dialog data-testid='test-dialog'>Dialog content</dialog>
        </>,
      );

      const popoverTrigger = screen.getByRole('button');
      await act(async () => popoverTrigger.click());
      expect(screen.getByText(contentText)).toBeVisible();

      /* Open the dialog modally so it covers the popover in the top layer */
      const dialog = screen.getByTestId('test-dialog') as HTMLDialogElement;
      await act(async () => dialog.showModal());
      expect(dialog.open).toBe(true);

      /* Pressing Escape should close the dialog but NOT the popover */
      const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      await act(async () => document.dispatchEvent(esc));

      /* Popover should still be visible since it was not the top-layer element */
      expect(screen.getByText(contentText)).toBeVisible();
    });

    it('should close the popover with Escape when no dialog is open', async () => {
      render(
        <>
          <Popover.TriggerContext>
            <Popover.Trigger>trigger</Popover.Trigger>
            <Popover>{contentText}</Popover>
          </Popover.TriggerContext>
          <dialog data-testid='test-dialog'>Dialog content</dialog>
        </>,
      );

      const popoverTrigger = screen.getByRole('button');
      await act(async () => popoverTrigger.click());
      expect(screen.getByText(contentText)).toBeVisible();

      /* Dialog is present in DOM but NOT open */
      const dialog = screen.getByTestId('test-dialog') as HTMLDialogElement;
      expect(dialog.open).toBe(false);

      /* Pressing Escape should close the popover since it is the top-layer element */
      const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      await act(async () => document.dispatchEvent(esc));

      expect(screen.getByText(contentText)).not.toBeVisible();
    });

    it('should not call onClose when Escape is pressed with a modal dialog open', async () => {
      const onClose = vi.fn();
      render(
        <>
          <Popover.TriggerContext>
            <Popover.Trigger>trigger</Popover.Trigger>
            <Popover onClose={onClose}>{contentText}</Popover>
          </Popover.TriggerContext>
          <dialog data-testid='test-dialog'>Dialog content</dialog>
        </>,
      );

      const popoverTrigger = screen.getByRole('button');
      await act(async () => popoverTrigger.click());

      const dialog = screen.getByTestId('test-dialog') as HTMLDialogElement;
      await act(async () => dialog.showModal());

      const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      await act(async () => document.dispatchEvent(esc));

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape is pressed with the popover on top and no open dialog', async () => {
      const onClose = vi.fn();
      render(
        <Popover.TriggerContext>
          <Popover.Trigger>trigger</Popover.Trigger>
          <Popover onClose={onClose}>{contentText}</Popover>
        </Popover.TriggerContext>,
      );

      const popoverTrigger = screen.getByRole('button');
      await act(async () => popoverTrigger.click());

      const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      await act(async () => document.dispatchEvent(esc));

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
