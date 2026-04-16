/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';

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

describe('Dialog behavior', () => {
  it('should set aria-haspopup on show-modal buttons', async () => {
    render();

    const button = document.querySelector('button') as HTMLButtonElement;

    await new Promise((resolve) => setTimeout(resolve, 0)); // Let mutation observer run
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
