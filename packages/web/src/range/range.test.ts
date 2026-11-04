/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it } from 'vitest';

const tick = () => new Promise((resolve) => setTimeout(resolve));
const getValue = (el: HTMLElement) =>
  el.style.getPropertyValue('--_ds-range-value');

describe('range', () => {
  it('sets value as percentage when added to DOM', async () => {
    document.body.innerHTML = `<input type="range" value="25" />`;
    await tick();

    const range = document.querySelector('input') as HTMLInputElement;
    expect(getValue(range)).toBe('25%');
  });

  it('respects min and max', async () => {
    document.body.innerHTML = `<input type="range" min="10" max="20" value="15" />`;
    await tick();

    const range = document.querySelector('input') as HTMLInputElement;
    expect(getValue(range)).toBe('50%');
  });

  it('updates on input event', async () => {
    document.body.innerHTML = `<input type="range" value="0" />`;
    await tick();

    const range = document.querySelector('input') as HTMLInputElement;
    range.value = '80';
    range.dispatchEvent(new Event('input', { bubbles: true }));

    expect(getValue(range)).toBe('80%');
  });

  it('updates when value attribute changes', async () => {
    document.body.innerHTML = `<input type="range" value="0" />`;
    await tick();

    const range = document.querySelector('input') as HTMLInputElement;
    range.setAttribute('value', '60');
    await tick();

    expect(getValue(range)).toBe('60%');
  });

  it('updates on form reset', async () => {
    document.body.innerHTML = `<form><input type="range" value="30" /></form>`;
    await tick();

    const form = document.querySelector('form') as HTMLFormElement;
    const range = document.querySelector('input') as HTMLInputElement;
    range.value = '90';
    range.dispatchEvent(new Event('input', { bubbles: true }));
    form.reset();
    await tick();

    expect(getValue(range)).toBe('30%');
  });

  it('ignores other inputs', async () => {
    document.body.innerHTML = `<input type="text" value="50" />`;
    await tick();

    const input = document.querySelector('input') as HTMLInputElement;
    expect(getValue(input)).toBe('');
  });
});
