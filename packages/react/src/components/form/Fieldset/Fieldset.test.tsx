import { render, screen } from '@testing-library/react';

import { Fieldset } from './';

describe('Fieldset', () => {
  test('has correct legend and description', () => {
    render(
      <Fieldset>
        <Fieldset.Legend>test legend</Fieldset.Legend>
        <Fieldset.Description>test description</Fieldset.Description>
      </Fieldset>,
    );
    const fieldset = screen.getByRole('group', { name: 'test legend' });
    expect(fieldset).toBeDefined();
    expect(fieldset).toHaveAccessibleDescription('test description');
  });
  test('and its children are disabled', () => {
    render(
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
