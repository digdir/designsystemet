import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import './suggestion';

const tick = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('suggestion component (trusted events)', () => {
  // Trusted events run microtasks between listeners, so the MutationObserver re-run
  // happens before <u-datalist> filters. Synthetic dispatchEvent can not reproduce this.
  it('shows the empty option when one keystroke goes from hits to no hits', async () => {
    document.body.innerHTML = `
      <ds-suggestion class="ds-suggestion">
        <input type="search" class="ds-input" />
        <u-datalist>
          <u-option data-empty>No results</u-option>
          <u-option value="Oslo">Oslo</u-option>
        </u-datalist>
      </ds-suggestion>
    `;
    const input = document.querySelector('input') as HTMLInputElement;
    const empty = document.querySelector('[data-empty]') as HTMLElement;

    await userEvent.click(input);
    await userEvent.keyboard('Os');
    await tick();
    expect(empty.hidden).toBe(true);

    await userEvent.keyboard('x');
    await tick();
    expect(empty.hidden).toBe(false);
  });
});
