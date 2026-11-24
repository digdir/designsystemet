import { describe, expect, it } from 'vitest';

const tick = async (_?: unknown) =>
  await new Promise((resolve) => setTimeout(resolve)); // Let MutationObserver run Loop

const createDescription = (text: string) => {
  const description = document.createElement('p');
  description.setAttribute('data-field', 'description');
  description.textContent = text;
  return description;
};

describe('Fieldset behavior', () => {
  it('should set aria-labelledby from legend and description', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>Delivery method</legend>
				<p data-field="description">Choose one option</p>
				<label><input type="radio" name="delivery" /> Mail</label>
			</fieldset>`;

    const fieldset = document.querySelector('fieldset');
    const legend = fieldset?.querySelector('legend');
    const description = fieldset?.querySelector('[data-field="description"]');

    await tick(); // Let mutation observer run
    expect(fieldset).toBeInTheDocument();
    expect(legend?.id).toBeTruthy();
    expect(description?.id).toBeTruthy();
    expect(fieldset).toHaveAttribute(
      'aria-labelledby',
      `${legend?.id} ${description?.id}`,
    );
  });

  it('should set aria-labelledby from legend and multiple descriptions', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>Delivery method</legend>
				<p data-field="description">Choose one option</p>
				<label><input type="radio" name="delivery" /> Mail</label>
				<p data-field="description">You can change this later</p>
			</fieldset>`;

    const fieldset = document.querySelector('fieldset');
    const legend = fieldset?.querySelector('legend');
    const [first, second] =
      fieldset?.querySelectorAll('[data-field="description"]') || [];

    await tick(); // Let mutation observer run
    expect(fieldset).toHaveAttribute(
      'aria-labelledby',
      `${legend?.id} ${first.id} ${second.id}`,
    );
  });

  it('should set aria-labelledby from description when no legend exists', async () => {
    document.body.innerHTML = `
			<fieldset>
				<p data-field="description">Choose one option</p>
			</fieldset>`;

    const fieldset = document.querySelector('fieldset');
    const description = fieldset?.querySelector('[data-field="description"]');

    await tick(); // Let mutation observer run
    expect(description?.id).toBeTruthy();
    expect(fieldset).toHaveAttribute('aria-labelledby', description?.id);
  });

  it('should not set aria-labelledby when only legend exists', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>Address type</legend>
				<p>Not a description</p>
				<label><input type="radio" name="address" /> Home</label>
			</fieldset>`;

    const fieldset = document.querySelector('fieldset');
    const legend = document.querySelector('legend');

    await tick(); // Let mutation observer run
    expect(fieldset).not.toHaveAttribute('aria-labelledby');
    expect(legend?.id).toBe('');
  });

  it('should not use descriptions that are not direct children', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>Address type</legend>
				<div><p data-field="description">Belongs to a field</p></div>
			</fieldset>`;

    await tick(); // Let mutation observer run
    expect(document.querySelector('fieldset')).not.toHaveAttribute(
      'aria-labelledby',
    );
  });

  it('should not set aria-labelledby when aria-label exists', async () => {
    document.body.innerHTML = `
			<fieldset aria-label="Payment method">
				<legend>Payment</legend>
				<p data-field="description">Select one</p>
			</fieldset>`;

    const fieldset = document.querySelector('fieldset');

    await tick(); // Let mutation observer run
    expect(fieldset).not.toHaveAttribute('aria-labelledby');
    expect(document.querySelector('legend')?.id).toBe('');
  });

  it('should ignore empty aria-label', async () => {
    document.body.innerHTML = `
			<fieldset aria-label=" ">
				<legend>Payment</legend>
				<p data-field="description">Select one</p>
			</fieldset>`;

    await tick(); // Let mutation observer run
    expect(document.querySelector('fieldset')).toHaveAttribute(
      'aria-labelledby',
    );
  });

  it('should not overwrite existing aria-labelledby', async () => {
    document.body.innerHTML = `
			<fieldset aria-labelledby="custom-id">
				<legend>Payment</legend>
				<p data-field="description">Select one</p>
			</fieldset>`;

    await tick(); // Let mutation observer run

    const fieldset = document.querySelector('fieldset');

    expect(fieldset).toHaveAttribute('aria-labelledby', 'custom-id');

    fieldset?.append(createDescription('Another description'));
    await tick(); // Let mutation observer run
    expect(fieldset).toHaveAttribute('aria-labelledby', 'custom-id');
  });

  it('should respect aria-labelledby changed by consumer', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>Payment</legend>
				<p data-field="description">Select one</p>
			</fieldset>`;

    const fieldset = document.querySelector('fieldset');

    await tick(); // Let mutation observer run
    expect(fieldset).toHaveAttribute('aria-labelledby');

    fieldset?.setAttribute('aria-labelledby', 'custom-id');
    fieldset?.append(createDescription('Another description'));
    await tick(); // Let mutation observer run
    expect(fieldset).toHaveAttribute('aria-labelledby', 'custom-id');
  });

  it('should keep aria-labelledby in sync when descriptions are added and removed', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>Notifications</legend>
				<label><input type="checkbox" /> Email</label>
			</fieldset>`;

    const fieldset = document.querySelector('fieldset');
    const legend = document.querySelector('legend');
    const first = createDescription('Pick the channels you want updates on');
    const second = createDescription('You can change this later');

    await tick(); // Let mutation observer run
    expect(fieldset).not.toHaveAttribute('aria-labelledby');

    legend?.after(first);
    await tick(); // Let mutation observer run
    expect(fieldset).toHaveAttribute(
      'aria-labelledby',
      `${legend?.id} ${first.id}`,
    );

    fieldset?.append(second);
    await tick(); // Let mutation observer run
    expect(fieldset).toHaveAttribute(
      'aria-labelledby',
      `${legend?.id} ${first.id} ${second.id}`,
    );

    first.remove();
    await tick(); // Let mutation observer run
    expect(fieldset).toHaveAttribute(
      'aria-labelledby',
      `${legend?.id} ${second.id}`,
    );

    second.remove();
    await tick(); // Let mutation observer run
    expect(fieldset).not.toHaveAttribute('aria-labelledby');
  });

  // aria-labelledby announces referenced elements even when they are hidden,
  // so hidden descriptions are included and the value does not change with [hidden]
  it('should include hidden descriptions', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>Notifications</legend>
				<p data-field="description" hidden>Pick the channels</p>
			</fieldset>`;

    const fieldset = document.querySelector('fieldset');
    const legend = document.querySelector('legend');
    const description = document.querySelector<HTMLElement>('p');

    await tick(); // Let mutation observer run
    const labelledby = `${legend?.id} ${description?.id}`;
    expect(legend?.id).toBeTruthy();
    expect(description?.id).toBeTruthy();
    expect(fieldset).toHaveAttribute('aria-labelledby', labelledby);

    description?.removeAttribute('hidden');
    await tick(); // Let mutation observer run
    expect(fieldset).toHaveAttribute('aria-labelledby', labelledby);

    description?.setAttribute('hidden', '');
    await tick(); // Let mutation observer run
    expect(fieldset).toHaveAttribute('aria-labelledby', labelledby);
  });

  it('should sync when data-field changes', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>Notifications</legend>
				<p>Pick the channels</p>
			</fieldset>`;

    const fieldset = document.querySelector('fieldset');
    const legend = document.querySelector('legend');
    const description = document.querySelector('p');

    await tick(); // Let mutation observer run
    expect(fieldset).not.toHaveAttribute('aria-labelledby');

    description?.setAttribute('data-field', 'description');
    await tick(); // Let mutation observer run
    expect(fieldset).toHaveAttribute(
      'aria-labelledby',
      `${legend?.id} ${description?.id}`,
    );

    description?.removeAttribute('data-field');
    await tick(); // Let mutation observer run
    expect(fieldset).not.toHaveAttribute('aria-labelledby');
  });

  it('should only use the first legend', async () => {
    document.body.innerHTML = `
			<fieldset>
				<legend>First</legend>
				<legend>Second</legend>
				<p data-field="description">Select one</p>
			</fieldset>`;

    const fieldset = document.querySelector('fieldset');
    const [first, second] = document.querySelectorAll('legend');
    const description = document.querySelector('p');

    await tick(); // Let mutation observer run
    expect(second.id).toBe('');
    expect(fieldset).toHaveAttribute(
      'aria-labelledby',
      `${first.id} ${description?.id}`,
    );
  });
});
