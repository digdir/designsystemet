/// <reference types="@testing-library/jest-dom" />

import '../suggestion/suggestion';
import { describe, expect, it } from 'vitest';

describe('search behavior', () => {
  it('clears and focuses the sibling input when the clear button is clicked', () => {
    document.body.innerHTML = `
      <ds-suggestion class="ds-search">
        <input type="search" value="Hello" />
        <button type="reset"></button>
      </ds-suggestion>
    `;

    const input = document.querySelector('input') as HTMLInputElement;
    const button = document.querySelector('button') as HTMLButtonElement;

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
  });

  it('ignores clicks outside .ds-search or on non-clear buttons', () => {
    document.body.innerHTML = `
      <ds-suggestion class="ds-search">
        <input type="search" value="Hello" />
        <button type="button"></button>
      </ds-suggestion>
    `;

    const input = document.querySelector('input') as HTMLInputElement;
    const button = document.querySelector('button') as HTMLButtonElement;

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(false);
    expect(input.value).toBe('Hello');
  });
});
