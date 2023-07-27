import React from 'react';
import { render, screen } from '@testing-library/react';

import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  test('has correct legend and description', (): void => {
    render(
      <Fieldset
        legend='test legend'
        description='test description'
      ></Fieldset>,
    );
    expect(screen.getByRole('group', { name: 'test legend' })).toBeDefined();
    expect(
      screen.getByRole('group', { description: 'test description' }),
    ).toBeDefined();
  });
});
