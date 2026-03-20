import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { Textfield } from '../textfield/textfield';
import { Fieldset } from './';

describe('Fieldset', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('has correct legend', () => {
    renderAndRunTimers(
      <Fieldset>
        <Fieldset.Legend>test legend</Fieldset.Legend>
        <Fieldset.Description>test description</Fieldset.Description>
        <Textfield label='Test' />
      </Fieldset>,
    );
    const fieldset = screen.getByRole('group', { name: 'test legend' });
    expect(fieldset).toBeDefined();
  });

  test('has correct description', () => {
    renderAndRunTimers(
      <Fieldset>
        <Fieldset.Legend>test legend</Fieldset.Legend>
        <Fieldset.Description>test description</Fieldset.Description>
        <Textfield label='Test' />
      </Fieldset>,
    );
    const fieldset = screen.getByRole('group', {
      description: 'test description',
    });
    expect(fieldset).toBeDefined();
    expect(fieldset).toHaveAccessibleDescription('test description');
  });

  test('and its children are disabled', () => {
    renderAndRunTimers(
      <Fieldset disabled>
        <Fieldset.Legend>test legend</Fieldset.Legend>
        <input value='test' readOnly />
      </Fieldset>,
    );

    const input = screen.getByDisplayValue<HTMLInputElement>('test');

    expect(input).toBeDisabled();
    expect(screen.getByRole('group')).toBeDisabled();
  });
});

function renderAndRunTimers(...args: Parameters<typeof render>): RenderResult {
  const view = render(...args);
  vi.runAllTimers();
  return view;
}
