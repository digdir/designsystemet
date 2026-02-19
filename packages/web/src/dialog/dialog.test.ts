/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

const user = userEvent.setup();
const flushTimers = async () => {
  vi.runAllTimers();
};

const renderDefault = async () => {
  document.body.innerHTML = `
<button command="show-modal" commandfor="my-dialog">
    Open dialog
</button>
<dialog id="my-dialog" class="ds-dialog">
    <h2 class="ds-heading">Dialog title</h2>
    <p>Dialog content</p>
    <button command="close" commandfor="my-dialog">Close</button>
</dialog>`;
  await flushTimers();
};

describe('Dialog behavior', () => {
  it('should set aria-haspopup on show-modal buttons', async () => {
    await renderDefault();

    const button = document.querySelector('button') as HTMLButtonElement;

    await user.click(button); // Trigger mutation observer to set aria-haspopup

    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('should call show for --show-non-modal command', async () => {
    await renderDefault();

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
    await flushTimers();

    expect(showSpy).toHaveBeenCalledTimes(1);
  });
});
