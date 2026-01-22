/// <reference types="@testing-library/jest-dom" />
import '../index';

import { describe, expect, it, test } from 'vitest';

test('renders name', () => {
  document.body.innerHTML = `<ds-field class="ds-field">
      <label>Label</label>
      <input type="text" placeholder="Placeholder" class="ds-input" />
      <div class="ds-validation-message" data-field="validation">
        Dette er ein feilmelding
      </div>
    </ds-field>`;

  const element = document.querySelector('ds-field');
  expect(element).toBeInTheDocument();
});

describe('Field component', () => {
  it('should add id and connect label and input', () => {
    const label = document.querySelector('label');
    const input = document.querySelector('input');
    expect(label).toHaveAttribute('for', input?.id);
    expect(input).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(''),
    );
  });
});
