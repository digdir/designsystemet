/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

const render = () => {
  document.body.innerHTML = `
    <fieldset class="ds-toggle-group" focusgroup="radiogroup" aria-label="Tekstjustering">
      <label>
        <input type="radio" name="alignment" value="left" checked />
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
  it('moves only focus (not selection) with arrow keys and wraps', async () => {
    const { inputs } = render();

    inputs[0].focus();
    expect(inputs[0]).toBeChecked();

    await userEvent.keyboard('{ArrowLeft}');
    expect(inputs[2]).toHaveFocus();
    expect(inputs[0]).toBeChecked();

    await userEvent.keyboard('{ArrowRight}');
    expect(inputs[0]).toHaveFocus();
    expect(inputs[0]).toBeChecked();
  });

  it('clicks input on Enter', async () => {
    const { inputs } = render();

    const clickSpy = vi.spyOn(inputs[1], 'click');

    inputs[0].focus();
    expect(inputs[0]).toHaveFocus();
    expect(inputs[0]).toBeChecked();

    await userEvent.keyboard('{ArrowRight}');
    expect(inputs[0]).toBeChecked();
    expect(inputs[1]).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(inputs[1]).toBeChecked();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
