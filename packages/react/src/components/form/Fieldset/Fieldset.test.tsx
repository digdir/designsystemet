import React from 'react';
import { render, screen } from '@testing-library/react';

import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  test('has correct legend and description', () => {
    render(
      <Fieldset
        legend='test legend'
        description='test description'
      ></Fieldset>,
    );
    const fieldset = screen.getByRole('group', { name: 'test legend' });
    expect(fieldset).toBeDefined();
    expect(fieldset).toHaveAccessibleDescription('test description');
  });
  test('is described by error message and invalid', () => {
    render(
      <Fieldset
        legend='test legend'
        description='test description'
        error='test error'
      ></Fieldset>,
    );

    const errorFieldset = screen.getByRole('group', {
      description: 'test description test error',
    });
    expect(errorFieldset).toBeDefined();
    expect(errorFieldset).toHaveAccessibleDescription(
      'test description test error',
    );
    expect(errorFieldset).toBeInvalid();
  });
  test('is disabled', () => {
    render(<Fieldset disabled></Fieldset>);
    expect(screen.getByRole('group')).toBeDisabled();
  });
});
