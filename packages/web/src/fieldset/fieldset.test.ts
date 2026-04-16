import { describe, expect, it } from 'vitest';

describe('Fieldset behavior', () => {
  it('should set aria-labelledby from legend and description', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>Delivery method</legend>
				<p data-field="description">Choose one option</p>
				<label><input type="radio" name="delivery" /> Mail</label>
			</fieldset>`;

    await new Promise((resolve) => setTimeout(resolve, 0)); // Let mutation observer run

    const fieldset = document.querySelector('fieldset');
    const legend = document.querySelector('legend');
    const description = document.querySelector('[data-field="description"]');

    expect(fieldset).toBeInTheDocument();
    expect(legend?.id).toBeTruthy();
    expect(description?.id).toBeTruthy();
    expect(fieldset).toHaveAttribute(
      'aria-labelledby',
      `${legend?.id} ${description?.id}`,
    );
  });

  it('should use legend + next paragraph as description fallback', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>Notifications</legend>
				<p>Pick the channels you want updates on</p>
				<label><input type="checkbox" /> Email</label>
			</fieldset>`;

    await new Promise((resolve) => setTimeout(resolve, 0)); // Let mutation observer run

    const fieldset = document.querySelector('fieldset');
    const legend = document.querySelector('legend');
    const fallbackDescription = document.querySelector('legend + p');

    expect(legend?.id).toBeTruthy();
    expect(fallbackDescription?.id).toBeTruthy();
    expect(fieldset).toHaveAttribute(
      'aria-labelledby',
      `${legend?.id} ${fallbackDescription?.id}`,
    );
  });

  it('should not overwrite existing aria-labelledby', async () => {
    document.body.innerHTML = `
			<fieldset aria-labelledby="custom-id">
				<legend>Payment</legend>
				<p data-field="description">Select one</p>
			</fieldset>`;

    await new Promise((resolve) => setTimeout(resolve, 0)); // Let mutation observer run

    const fieldset = document.querySelector('fieldset');

    expect(fieldset).toHaveAttribute('aria-labelledby', 'custom-id');
  });

  it('should set aria-labelledby to legend id when no description exists', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>Address type</legend>
				<label><input type="radio" name="address" /> Home</label>
			</fieldset>`;

    await new Promise((resolve) => setTimeout(resolve, 0)); // Let mutation observer run

    const fieldset = document.querySelector('fieldset');
    const legend = document.querySelector('legend');

    expect(legend?.id).toBeTruthy();
    expect(fieldset).toHaveAttribute('aria-labelledby', legend?.id);
  });
});
