/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';

const render = () => {
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

  const group = document.querySelector('fieldset') as HTMLFieldSetElement;
  const inputs = [...group.querySelectorAll('input')];

  return { group, inputs };
};

describe('toggle-group behavior', () => {
  it('sets data-toggle-group from aria-label', async () => {
    const { group } = render();
    await new Promise((resolve) => setTimeout(resolve, 0)); // Let mutation observer run
    expect(group).toHaveAttribute('aria-label', 'Tekstjustering');
  });

  it('clicks input on Enter', () => {
    const { inputs } = render();

    const clickSpy = vi.spyOn(inputs[0], 'click');

    inputs[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('moves focus with arrow keys and wraps', async () => {
    const { inputs } = render();

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
