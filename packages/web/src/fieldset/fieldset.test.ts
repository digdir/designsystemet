import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

// Test data:
const legend = 'Lorem ipsum';
const description = 'Vivamus at pretium elit.';
const fieldsetHtml = `
  <fieldset>
    <legend>${legend}</legend>
    <p data-field="description">${description}</p>
    <ds-field>
      <label>Test</label>
      <input name="test" type="text"/>
    </ds-field>
  </fieldset>
`;

describe('fieldset', () => {
  it('Displays the group', async () => {
    renderFieldset();
    await expect.element(page.getByRole('group')).toBeVisible();
  });

  it('Applies the legend to the fieldset', async () => {
    renderFieldset();
    await expect.element(page.getByRole('group')).toHaveAccessibleName(legend);
  });

  it('Applies the description to the fieldset', async () => {
    renderFieldset();
    await expect
      .element(page.getByRole('group'))
      .toHaveAccessibleDescription(description);
  });
});

function renderFieldset(): void {
  document.body.innerHTML = fieldsetHtml;
  vi.runAllTimers();
}
