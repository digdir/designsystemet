/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';
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

  it('hides the empty option while a query partially matches other options', async () => {
    const suggestion = render();
    const input = suggestion.querySelector('input') as HTMLInputElement;
    const empty = suggestion.querySelector('[data-empty]') as HTMLElement;

    await tick(); // Let mutation observer run

    input.value = 'ion';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(empty.hidden).toBe(true);

    input.value = 'missing';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(empty.hidden).toBe(false);
  });

  it('shows the empty option when a data-nofilter list has disabled every other option', async () => {
    const suggestion = render();
    const input = suggestion.querySelector('input') as HTMLInputElement;
    const empty = suggestion.querySelector('[data-empty]') as HTMLElement;
    const option = suggestion.querySelector(
      'u-option[value="option-1"]',
    ) as HTMLOptionElement;

    suggestion.list?.setAttribute('data-nofilter', '');
    input.value = 'missing';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(empty.hidden).toBe(true); // Not filtered by label with data-nofilter

    option.disabled = true; // Like the filter in React <Suggestion>, which runs after the input event
    await tick(); // Let mutation observer run
    expect(empty.hidden).toBe(false);
  });

  it('hides the empty option when options are added to the list', async () => {
    const suggestion = renderEmptyOnly();
    const empty = suggestion.querySelector('[data-empty]') as HTMLElement;

    await tick(); // Let mutation observer run
    expect(empty.hidden).toBe(false);

    suggestion.list?.insertAdjacentHTML(
      'beforeend',
      '<u-option value="oslo">Oslo</u-option>',
    );
    await tick(); // Let mutation observer run
    expect(empty.hidden).toBe(true);
  });

  it('announces a hit count that excludes the hidden empty option', {
    tags: ['browser'],
  }, async () => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <ds-suggestion class="ds-suggestion" data-sr-singular="%d forslag" data-sr-plural="%d forslag">
        <input type="search" class="ds-input" />
        <u-datalist>
          <u-option data-empty>Ingen treff</u-option>
          <u-option value="Sogndal">Sogndal</u-option>
          <u-option value="Oslo">Oslo</u-option>
          <u-option value="Bergen">Bergen</u-option>
        </u-datalist>
      </ds-suggestion>
    `;
    const input = document.querySelector('input') as HTMLInputElement;
    const announced: string[] = [];
    const observer = new MutationObserver((records) => {
      for (const { target } of records)
        if (target instanceof Element && target.matches('[aria-live]'))
          announced.push(target.textContent?.trim() || ''); // trim() also removes the alternating &nbsp; from u-datalist
    });
    observer.observe(document.body, { childList: true, subtree: true });

    input.focus();
    input.click(); // Open first, as u-datalist does not announce hits when typing opens the list
    await vi.advanceTimersByTimeAsync(100);

    input.value = 'ogn';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(600); // u-datalist announces hits 500 ms after the last input

    observer.disconnect();
    vi.useRealTimers();
    // Only check hit counts, as u-combobox can announce "Added …" from earlier tests in its own live region
    expect(announced.filter((text) => text.endsWith('forslag'))).toEqual([
      '1 forslag',
    ]);
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
