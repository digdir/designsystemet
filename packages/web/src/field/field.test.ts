/// <reference types="@testing-library/jest-dom" />
import { describe, expect, it, test } from 'vitest';

const act = async (_: unknown) =>
  await new Promise((resolve) => setTimeout(resolve)); // Let MutationObserver run Loop

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

    await act(counter?.setAttribute('data-limit', '10'));
    expect(counter?.getAttribute('data-label')).toBe('23 tegn for mye');
  });

  test('should not override aria-invalid when already set on input', async () => {
    document.body.innerHTML = `<ds-field>
    <label>Label</label>
    <input type="text" aria-invalid="false" />
    <div data-field="validation">
      Dette er ein feilmelding
    </div>
  </ds-field>`;

    const input = document.querySelector('input');
    const validation = document.querySelector('[data-field="validation"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false'); // ds-field must not override the consumer-provided aria-invalid="false"

    input?.removeAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-invalid');

    await act(validation?.setAttribute('hidden', ''));
    await act(validation?.removeAttribute('hidden'));
    expect(input).toHaveAttribute('aria-invalid', 'true'); // Validation element should now cause ds-field to set aria-invalid="true"

    await act(validation?.setAttribute('hidden', ''));
    expect(input).not.toHaveAttribute('aria-invalid'); // And it should remove aria-invalid when validation element is removed/hidden

    input?.setAttribute('aria-invalid', 'true');
    await act(validation?.removeAttribute('hidden'));
    await act(validation?.setAttribute('hidden', ''));
    expect(input).toHaveAttribute('aria-invalid', 'true'); // But it should not remove aria-invalid if it was already set to "true" by the consumer
  });
});
