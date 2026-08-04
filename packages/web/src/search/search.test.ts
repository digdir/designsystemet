/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it } from 'vitest';

describe('search behavior', () => {
  it('clears and focuses the sibling input when the clear button is clicked', () => {
    document.body.innerHTML = `
      <div class="ds-search">
        <input type="search" value="Hello" />
        <button type="reset" data-search="clear"></button>
      </div>
    `;

    const input = document.querySelector('input') as HTMLInputElement;
    const button = document.querySelector('button') as HTMLButtonElement;

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
  });

  it('does not clear the input if the click was already handled', () => {
    document.body.innerHTML = `
      <div class="ds-search">
        <input type="search" value="Hello" />
        <button type="reset" data-search="clear"></button>
      </div>
    `;

    const input = document.querySelector('input') as HTMLInputElement;
    const button = document.querySelector('button') as HTMLButtonElement;

    button.addEventListener('click', (event) => event.preventDefault()); // Simulate React's client Search.Clear already handling it

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(click);

    expect(input.value).toBe('Hello');
  });

  it('ignores clicks outside .ds-search or on non-clear buttons', () => {
    document.body.innerHTML = `
      <div class="ds-search">
        <input type="search" value="Hello" />
        <button type="button"></button>
      </div>
    `;

    const input = document.querySelector('input') as HTMLInputElement;
    const button = document.querySelector('button') as HTMLButtonElement;

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(false);
    expect(input.value).toBe('Hello');
  });
});
