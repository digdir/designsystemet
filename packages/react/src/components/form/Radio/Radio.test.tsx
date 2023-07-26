import React from 'react';
import { render, screen } from '@testing-library/react';

import { Radio } from './Radio';

describe('Radio', () => {
  test('has correct value and label', (): void => {
    render(<Radio value='test'>test text</Radio>);
    expect(screen.getByLabelText('test text')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  test('has correct description', (): void => {
    render(
      <Radio
        value='test'
        description='description'
      >
        test
      </Radio>,
    );
    expect(
      screen.getByRole('radio', { description: 'description' }),
    ).toBeDefined();
  });
  //TODO is there a good way to test size?
});
