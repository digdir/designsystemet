/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it } from 'vitest';

describe('readonly behavior', () => {
  it('prevents non-Tab keydowns on readonly inputs', () => {
    document.body.innerHTML = `<input id="field" type="text" readonly />`;

    const input = document.getElementById('field') as HTMLInputElement;

    const blocked = new KeyboardEvent('keydown', {
      key: 'a',
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(blocked);

    const allowed = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(allowed);

    expect(blocked.defaultPrevented).toBe(true);
    expect(allowed.defaultPrevented).toBe(false);
  });

  it('moves focus on readonly radio arrows without changing checked state', () => {
    document.body.innerHTML = `
      <input type="radio" name="group" aria-readonly="true" checked />
      <input type="radio" name="group" aria-readonly="true" />
      <input type="radio" name="group" aria-readonly="true" />
    `;

    const radios = Array.from(
      document.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    );

    radios[0].focus();

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });
    radios[0].dispatchEvent(event);

    expect(document.activeElement).toBe(radios[1]);
    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(false);
  });

  it('focuses readonly input when clicking its label', () => {
    document.body.innerHTML = `
      <label for="field">Label</label>
      <input id="field" type="text" readonly />
    `;

    const label = document.querySelector('label') as HTMLLabelElement;
    const input = document.getElementById('field') as HTMLInputElement;

    const click = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    label.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(input);
  });

  it('prevents mousedown on readonly selects', () => {
    document.body.innerHTML = `
      <select id="choices" aria-readonly="true">
        <option>One</option>
      </select>
    `;

    const select = document.getElementById('choices') as HTMLSelectElement;

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    select.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
