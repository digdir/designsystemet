/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it } from 'vitest';
import type { DSSuggestionElement } from './suggestion';

const render = () => {
  document.body.innerHTML = `
    <ds-suggestion class="ds-suggestion">
      <input type="search" class="ds-input" />
      <u-datalist role="listbox">
        <u-option value="option-1">Option 1</u-option>
      </u-datalist>
    </ds-suggestion>
  `;

  return document.querySelector('ds-suggestion') as DSSuggestionElement;
};

describe('suggestion component', () => {
  it('sets placeholder, popovertarget, and popover attributes', async () => {
    const suggestion = render();
    const input = suggestion.querySelector('input') as HTMLInputElement;
    const list = suggestion.querySelector('u-datalist') as HTMLElement;

    await new Promise((resolve) => setTimeout(resolve, 0)); // Let mutation observer run

    expect(input).toHaveAttribute('placeholder', ' ');
    expect(list.id).toBeTruthy();
    expect(input).toHaveAttribute('popovertarget', list.id);
    expect(list).toHaveAttribute('popover', 'manual');
  });

  it('dispatches ds-toggle-source when opened', () => {
    const suggestion = render();
    const input = suggestion.querySelector('input') as HTMLInputElement;
    const list = suggestion.querySelector('u-datalist') as HTMLElement;

    let detail: Element | undefined;
    list.addEventListener('ds-toggle-source', (event) => {
      detail = (event as CustomEvent<Element>).detail;
    });

    const event = new Event('toggle') as Event & { newState?: string };
    event.newState = 'open';
    suggestion.dispatchEvent(event);

    expect(detail).toBe(input);
  });
});
