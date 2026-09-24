/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it } from 'vitest';
import type { DSSuggestionElement } from './suggestion';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

const render = () => {
  document.body.innerHTML = `
    <ds-suggestion class="ds-suggestion">
      <input type="search" class="ds-input" />
      <u-datalist role="listbox">
        <u-option data-empty>No results</u-option>
        <u-option value="option-1">Option 1</u-option>
      </u-datalist>
    </ds-suggestion>
  `;

  return document.querySelector('ds-suggestion') as DSSuggestionElement;
};

const renderEmptyOnly = () => {
  document.body.innerHTML = `
    <ds-suggestion class="ds-suggestion">
      <input type="search" class="ds-input" />
      <u-datalist role="listbox">
        <u-option data-empty>No results</u-option>
      </u-datalist>
    </ds-suggestion>
  `;

  return document.querySelector('ds-suggestion') as DSSuggestionElement;
};

const renderMultiple = () => {
  document.body.innerHTML = `
    <ds-suggestion class="ds-suggestion" data-multiple>
      <input type="search" class="ds-input" />
      <u-datalist role="listbox">
        <u-option data-empty>No results</u-option>
        <u-option label="Oslo" value="Osl">Oslo</u-option>
      </u-datalist>
    </ds-suggestion>
  `;
  return document.querySelector('ds-suggestion') as DSSuggestionElement;
};

const renderCreatable = () => {
  document.body.innerHTML = `
    <ds-suggestion data-creatable class="ds-suggestion">
      <input type="search" class="ds-input" />
      <u-datalist role="listbox">
        <u-option data-empty="Add %s">No results</u-option>
      </u-datalist>
    </ds-suggestion>
  `;

  return document.querySelector('ds-suggestion') as DSSuggestionElement;
};

describe('suggestion component', () => {
  it('propagates CSS screen-reader translations on connect', () => {
    const suggestion = document.createElement('ds-suggestion');
    suggestion.innerHTML = `
      <input type="search" class="ds-input" />
      <u-datalist role="listbox"></u-datalist>
    `;
    suggestion.style.setProperty('--_ds-data-sr-added', 'Lagt til');
    suggestion.style.setProperty('--_ds-data-sr-singular', 'treff');
    suggestion.style.setProperty('--_ds-data-sr-plural', 'treff');
    document.body.appendChild(suggestion);

    const list = suggestion.querySelector('u-datalist') as HTMLElement;

    expect(suggestion).toHaveAttribute('data-sr-added', 'Lagt til');
    expect(suggestion).toHaveAttribute('data-sr-singular', 'treff');
    expect(suggestion).toHaveAttribute('data-sr-plural', 'treff');
    expect(list).toHaveAttribute('data-sr-singular', 'treff');
    expect(list).toHaveAttribute('data-sr-plural', 'treff');
  });

  it('sets popovertarget, and popover attributes', async () => {
    const suggestion = render();
    const input = suggestion.querySelector('input') as HTMLInputElement;
    const list = suggestion.querySelector('u-datalist') as HTMLElement;

    await new Promise((resolve) => setTimeout(resolve, 0)); // Let mutation observer run

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

  it('hides the empty option initially when selectable options exist', async () => {
    const suggestion = render();
    const empty = suggestion.querySelector('[data-empty]') as HTMLElement;

    await new Promise((resolve) => setTimeout(resolve, 0)); // Let mutation observer run

    expect(empty.hidden).toBe(true);
  });

  it('keeps the empty option visible when it is the only option', async () => {
    const suggestion = renderEmptyOnly();
    const input = suggestion.querySelector('input') as HTMLInputElement;
    const empty = suggestion.querySelector('[data-empty]') as HTMLElement;

    await tick(); // Let mutation observer run

    expect(empty.hidden).toBe(false);

    input.value = 'missing';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(empty.hidden).toBe(false);
  });

  it('keeps the typed query in the input when selecting with data-multiple', async () => {
    const suggestion = renderMultiple();
    const input = suggestion.querySelector('input') as HTMLInputElement;
    const option = suggestion.querySelector(
      'u-option[value="Osl"]',
    ) as HTMLElement;

    await tick(); // Let mutation observer run

    input.focus();
    input.value = 'os';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await tick();

    option.click();
    await tick();

    const chip = suggestion.querySelector('data') as HTMLDataElement;
    expect(chip.value).toBe('Osl');
    expect(chip.textContent).toBe('Oslo');
    /* u-combobox 2.1.4 left the option value in the input instead */
    expect(input.value).toBe('os');
  });

  it('hides the empty option initially for a creatable suggestion', async () => {
    const suggestion = renderCreatable();
    const empty = suggestion.querySelector('[data-empty]') as HTMLElement;

    await tick();

    expect(empty.hidden).toBe(true);
  });

  it('uses selected values instead of options to detect an existing creatable value', async () => {
    const suggestion = renderCreatable();
    const input = suggestion.querySelector('input') as HTMLInputElement;
    const empty = suggestion.querySelector('[data-empty]') as HTMLElement;

    Object.defineProperty(suggestion, 'values', {
      configurable: true,
      value: ['new value'],
    });
    input.value = 'new value';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(empty).toHaveAttribute('data-create', 'new value');
    expect(empty).toHaveAttribute('disabled', 'true');
  });
});
