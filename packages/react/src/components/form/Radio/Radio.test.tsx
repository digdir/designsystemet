import React from 'react';
import { render, screen } from '@testing-library/react';

import { Radio } from './Radio';

describe('Radio', () => {
  test('myProp should add myClass', (): void => {
    render(<Radio>test text</Radio>);
    expect(screen.getByLabelText('test text')).toBeDefined();
  });
});
