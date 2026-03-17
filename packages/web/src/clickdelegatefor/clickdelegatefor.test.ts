/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

const user = userEvent.setup();

describe('data-clickdelegatefor', () => {
  it('should delegate click to target element', async () => {
    document.body.innerHTML = `
      <div data-clickdelegatefor="target">
        <input id="target" type="checkbox" >Link</input>
        <span>Click area</span>
      </div>
    `;

    const target = document.querySelector('input') as HTMLInputElement;
    const area = document.querySelector('span') as HTMLElement;
    const targetSpy = vi.spyOn(target, 'click');

    expect(target.checked).toBe(false);

    await user.click(area);

    expect(targetSpy).toHaveBeenCalledTimes(1);
    expect(target.checked).toBe(true);

    targetSpy.mockRestore();
  });

  it('should ignore interactive elements inside the delegate', async () => {
    document.body.innerHTML = `
        <div data-clickdelegatefor="target">
          <input id="target" type="checkbox" >Link</input>
          <button>Should not delegate</button>
        </div>
      `;

    const target = document.getElementById('target') as HTMLInputElement;
    const skip = document.querySelector('button') as HTMLButtonElement;

    const targetSpy = vi.spyOn(target, 'click');

    await user.click(skip);

    expect(targetSpy).not.toHaveBeenCalled();
    expect(target.checked).toBe(false);

    targetSpy.mockRestore();
  });

  // TODO - Add test for ctrl/meta and middle click opening links in new tab, but having problems mocking window.open so leaving out for now
  // it('should open delegated anchors in new tab when ctrl/meta or middle click', async () => {
  //   document.body.innerHTML = `
  //       <div data-clickdelegatefor="target">
  //         <a id="target" href="https://example.com" rel="noopener">Target</a>
  //         <span>Click area</span>
  //       </div>
  //     `;

  //   const target = document.getElementById('target') as HTMLAnchorElement;
  //   const area = document.querySelector('span') as HTMLElement;

  //   area.parentElement?.addEventListener('click', (event) =>
  //     event.preventDefault(),
  //   ); // Prevent actual navigation in test environment
  //   const openSpy = vi.spyOn(globalThis, 'open').mockImplementation(() => null);

  //   await user.click(area, { ctrlKey: true }); // Ctrl+click

  //   expect(openSpy).toHaveBeenCalledWith(target.href, undefined, target.rel);

  //   openSpy.mockRestore();
  // });
});
