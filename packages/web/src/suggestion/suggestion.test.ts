/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';

type SuggestionElement = HTMLElement & {
  control?: HTMLInputElement;
  list?: HTMLElement;
};

const renderSuggestion = async () => {
  document.body.innerHTML = `
    <ds-suggestion class="ds-suggestion">
      <input type="search" class="ds-input" />
      <u-datalist>
        <u-option value="option-1">Option 1</u-option>
      </u-datalist>
    </ds-suggestion>
  `;

  const suggestion = document.querySelector(
    'ds-suggestion',
  ) as SuggestionElement;

  vi.runAllTimers();
  await vi.waitUntil(() => {
    const input = suggestion.querySelector('input');
    const list = suggestion.querySelector('u-datalist');
    return Boolean(
      input?.getAttribute('popovertarget') &&
        list?.getAttribute('popover') === 'manual',
    );
  });

  return suggestion;
};

describe('suggestion component', () => {
  it('sets placeholder, popovertarget, and popover attributes', async () => {
    const suggestion = await renderSuggestion();
    const input = suggestion.querySelector('input') as HTMLInputElement;
    const list = suggestion.querySelector('u-datalist') as HTMLElement;

    expect(input).toHaveAttribute('placeholder', ' ');
    expect(list.id).toBeTruthy();
    expect(input).toHaveAttribute('popovertarget', list.id);
    expect(list).toHaveAttribute('popover', 'manual');
  });

  it('dispatches ds-toggle-source when opened', async () => {
    const suggestion = await renderSuggestion();
    const input = suggestion.querySelector('input') as HTMLInputElement;
    const list = suggestion.querySelector('u-datalist') as HTMLElement;

    let detail: Element | undefined;
    list.addEventListener('ds-toggle-source', (event) => {
      detail = (event as CustomEvent<Element>).detail;
    });

    const event = new Event('toggle') as Event & { newState?: string };
    event.newState = 'open';
    suggestion.dispatchEvent(event);

    await vi.waitUntil(() => Boolean(detail));

    expect(detail).toBe(input);
  });
});
