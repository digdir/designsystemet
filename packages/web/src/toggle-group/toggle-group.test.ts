/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';

const renderToggleGroup = async () => {
  document.body.innerHTML = `
    <fieldset class="ds-toggle-group" data-toggle-group="Tekstjustering">
      <label>
        <input type="radio" name="alignment" value="left" />
        Left
      </label>
      <label>
        <input type="radio" name="alignment" value="center" />
        Center
      </label>
      <label>
        <input type="radio" name="alignment" value="right" />
        Right
      </label>
    </fieldset>
  `;

  vi.runAllTimers();

  const group = document.querySelector('[data-toggle-group]') as HTMLElement;
  const inputs = [...group.querySelectorAll('input')] as HTMLInputElement[];

  await vi.waitUntil(
    () => group.getAttribute('aria-label') === 'Tekstjustering',
  );

  return { group, inputs };
};

describe('toggle-group behavior', () => {
  it('sets aria-label from data-toggle-group', async () => {
    const { group } = await renderToggleGroup();

    expect(group).toHaveAttribute('aria-label', 'Tekstjustering');
  });

  it('clicks input on Enter', async () => {
    const { inputs } = await renderToggleGroup();

    const clickSpy = vi.spyOn(inputs[0], 'click');

    inputs[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('moves focus with arrow keys and wraps', async () => {
    const { inputs } = await renderToggleGroup();

    inputs[0].focus();

    inputs[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );

    await vi.waitUntil(() => document.activeElement === inputs[2]);

    inputs[2].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );

    await vi.waitUntil(() => document.activeElement === inputs[0]);

    expect(document.activeElement).toBe(inputs[0]);
  });
});
