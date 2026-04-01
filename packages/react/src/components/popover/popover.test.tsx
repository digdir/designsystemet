import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { act, render as renderRtl, screen } from '@testing-library/react';
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
    renderRtl(defaultPopover);
    const popoverTrigger = screen.getByRole('button');

    expect(screen.getByText(contentText)).not.toBeVisible();

    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();
  });

  it('should close when we click the button twitce', async () => {
    renderRtl(defaultPopover);
    const popoverTrigger = screen.getByRole('button');

    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).not.toBeVisible();
  });

  it('should close when we click outside', async () => {
    renderRtl(defaultPopover);

    const popoverTrigger = screen.getByRole('button');

    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    await act(async () => document.body.click());
    expect(screen.getByText(contentText)).not.toBeVisible();
  });

  it('should close when we press ESC', async () => {
    renderRtl(defaultPopover);

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    await act(async () => popoverTrigger.dispatchEvent(esc));
    expect(screen.getByText(contentText)).not.toBeVisible();
  });

  it('should close when we press SPACE', async () => {
    renderRtl(defaultPopover);

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    await act(async () => popoverTrigger.dispatchEvent(space));
    vi.waitFor(() => expect(screen.getByText(contentText)).not.toBeVisible()); // Wait for Popover API
  });

  it('should close when we press ENTER', async () => {
    renderRtl(defaultPopover);

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    await act(async () => popoverTrigger.dispatchEvent(enter));
    vi.waitFor(() => expect(screen.getByText(contentText)).not.toBeVisible()); // Wait for Popover API
  });

  it('should not close if we click inside the popover', async () => {
    renderRtl(defaultPopover);

    const popoverTrigger = screen.getByRole('button');
    await act(async () => popoverTrigger.click());
    expect(screen.getByText(contentText)).toBeVisible();

    await act(async () => screen.getByText(contentText).click());
    expect(screen.getByText(contentText)).toBeVisible();
  });

  it('should have correct id and popovertarget attributes', () => {
    renderRtl(defaultPopover);
    const trigger = screen.getByRole('button');
    const popover = screen.getByText(contentText);

    expect(trigger.getAttribute('popovertarget')).toBe(popover.id);
  });

  it('should be able to change content inside Popover trigger element but still toggle when controlled', async () => {
    const { container } = renderRtl(<CompControlled />);
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
    renderRtl(
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
    renderRtl(
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
      renderRtl(
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
      renderRtl(<CompControlledWithTrigger isInitiallyOpen onOpen={onOpen} />);
      const popoverTrigger = screen.getByRole('button');
      expect(screen.getByText(contentText)).toBeVisible();

      await act(async () => popoverTrigger.click());
      expect(onOpen).toHaveBeenCalledTimes(0);
    });
  });
});
