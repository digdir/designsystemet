import '../index';
import { expect, test } from 'vitest';

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
