/// <reference types="@testing-library/jest-dom" />

import { afterEach, describe, expect, it, vi } from 'vitest';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

// Mocks the dialog's box so pointer coordinates can be reliably placed inside/outside it
const setRect = (dialog: HTMLDialogElement, x: number, y: number) =>
  vi
    .spyOn(dialog, 'getBoundingClientRect')
    .mockReturnValue(new DOMRect(x, y, 100, 100));

// Simulates a click that, in a real modal, would target the <dialog> element
// itself (top-layer element captures pointer events), with clientX/Y determining
// whether the click landed on the visible content box or the surrounding backdrop.
const pointer = (type: string, el: Element, x: number, y: number) =>
  el.dispatchEvent(
    new PointerEvent(type, { bubbles: true, clientX: x, clientY: y }),
  );

const render = () => {
  document.body.innerHTML = `
<button command="show-modal" commandfor="my-dialog">
    Open dialog
</button>
<dialog id="my-dialog" class="ds-dialog">
    <h2 class="ds-heading">Dialog title</h2>
    <p>Dialog content</p>
    <button command="close" commandfor="my-dialog">Close</button>
</dialog>`;
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Dialog behavior', () => {
  it('should set aria-haspopup on focused show-modal buttons', async () => {
    render();

    const button = document.querySelector('button') as HTMLButtonElement;
    button.focus();
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('should call show for --show-non-modal command', async () => {
    render();

    const dialog = document.querySelector('dialog');

    const showSpy = vi.fn();
    // jsdom does not implement <dialog>.show, so define it for the test
    Object.defineProperty(dialog, 'show', {
      value: showSpy,
      configurable: true,
    });

    const event = new Event('command', { bubbles: true });
    (event as Event & { command?: string }).command = '--show-non-modal';

    dialog?.dispatchEvent(event);

    expect(showSpy).toHaveBeenCalledTimes(1);
  });
});

describe('Dialog closedby="any" Safari polyfill', () => {
  const renderClosedby = (closedby = 'any') => {
    document.body.innerHTML = `
<dialog id="my-dialog" class="ds-dialog" open closedby="${closedby}">
    <p>Dialog content</p>
</dialog>`;
    return document.getElementById('my-dialog') as HTMLDialogElement;
  };

  it('closes the dialog when pointerdown and pointerup both land outside its bounding rect', async () => {
    const dialog = renderClosedby();
    setRect(dialog, 100, 100); // Rect: 100-200 x 100-200
    const closeSpy = vi.spyOn(dialog, 'close');

    pointer('pointerdown', dialog, 500, 500); // Outside
    pointer('pointerup', dialog, 500, 500); // Outside
    await tick();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('does not close the dialog when pointerdown and pointerup both land inside its bounding rect', async () => {
    const dialog = renderClosedby();
    setRect(dialog, 100, 100);
    const closeSpy = vi.spyOn(dialog, 'close');

    pointer('pointerdown', dialog, 150, 150); // Inside
    pointer('pointerup', dialog, 150, 150); // Inside
    await tick();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('does not close when pointerdown starts inside but pointerup ends outside (text selection)', async () => {
    const dialog = renderClosedby();
    setRect(dialog, 100, 100);
    const closeSpy = vi.spyOn(dialog, 'close');

    pointer('pointerdown', dialog, 150, 150); // Inside - starts a selection
    pointer('pointerup', dialog, 500, 500); // Outside - drag ends on backdrop
    await tick();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('does not close when closedby is not "any"', async () => {
    const dialog = renderClosedby('closerequest');
    setRect(dialog, 100, 100);
    const closeSpy = vi.spyOn(dialog, 'close');

    pointer('pointerdown', dialog, 500, 500); // Outside
    pointer('pointerup', dialog, 500, 500); // Outside
    await tick();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('does not close a dialog that is already closed', async () => {
    const dialog = renderClosedby();
    dialog.removeAttribute('open');
    setRect(dialog, 100, 100);
    const closeSpy = vi.spyOn(dialog, 'close');

    pointer('pointerdown', dialog, 500, 500); // Outside
    pointer('pointerup', dialog, 500, 500); // Outside
    await tick();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('resets DOWN_INSIDE after pointerup, so a later outside click can still close', async () => {
    const dialog = renderClosedby();
    setRect(dialog, 100, 100);
    const closeSpy = vi.spyOn(dialog, 'close');

    // First: an inside click sequence, which should not close
    pointer('pointerdown', dialog, 150, 150);
    pointer('pointerup', dialog, 150, 150);
    await tick();
    expect(closeSpy).not.toHaveBeenCalled();

    // Then: an outside click sequence, which should close
    pointer('pointerdown', dialog, 500, 500);
    pointer('pointerup', dialog, 500, 500);
    await tick();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
