import React from 'react';
import { render, screen } from '@testing-library/react';

import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  test('has correct legend and description', (): void => {
    render(<Fieldset legend='test legend'></Fieldset>);
    expect(screen.getByRole('group', { name: 'test legend' })).toBeDefined();
  });
});
