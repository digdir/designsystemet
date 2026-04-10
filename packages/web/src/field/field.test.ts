/// <reference types="@testing-library/jest-dom" />
import { describe, expect, it, test, vi } from 'vitest';

const render = () => {
  document.body.innerHTML = `<ds-field class="ds-field">
      <label>Label</label>
      <input type="text" placeholder="Placeholder" class="ds-input" />
      <div class="ds-validation-message" data-field="validation">
        Dette er ein feilmelding
      </div>
    </ds-field>`;
};

describe('Field component', () => {
  it('should add id and connect label and input', () => {
    render();

    const label = document.querySelector('label');
    const input = document.querySelector('input');

    expect(input).toBeInTheDocument();
    expect(label).toBeInTheDocument();

    expect(label).toHaveAttribute('for', input?.id);
    expect(input).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(''),
    );
  });

  it('should set aria-invalid when validation message is present', () => {
    render();

    const input = document.querySelector('input');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('should update counter live region', () => {
    document.body.innerHTML = `<ds-field class="ds-field">
      <label>Label</label>
      <textarea class="ds-input">Dette er ein test som er for lang</textarea>
      <p class="ds-validation-message" data-field="counter" data-limit="20" data-over="%d tegn for mye" data-under="%d tegn igjen"></p>
    </ds-field>`;

    const textarea = document.querySelector('textarea');
    const counter = document.querySelector('[data-field="counter"]');
    expect(textarea).toBeInTheDocument();
    expect(counter).toBeInTheDocument();

    textarea?.dispatchEvent(new Event('input', { bubbles: true }));
    vi.advanceTimersByTime(150); // Advance past debounce time

    expect(counter?.getAttribute('data-label')).toBe('13 tegn for mye');
  });

  test('should update counter text based on data-limit', async () => {
    document.body.innerHTML = `<ds-field class="ds-field">
      <label>Label</label>
      <textarea class="ds-input">Dette er ein test som er for lang</textarea>
      <p class="ds-validation-message" data-field="counter" data-limit="20" data-over="%d tegn for mye" data-under="%d tegn igjen"></p>
    </ds-field>`;

    const textarea = document.querySelector('textarea');
    const counter = document.querySelector('[data-field="counter"]');
    expect(textarea).toBeInTheDocument();
    expect(counter).toBeInTheDocument();
    expect(counter?.getAttribute('data-label')).toBe('13 tegn for mye');

    counter?.setAttribute('data-limit', '10');
    await new Promise((resolve) => setTimeout(resolve, 0)); // Let MutationObserver in JS Event Loop run

    expect(counter?.getAttribute('data-label')).toBe('23 tegn for mye');
  });
});
