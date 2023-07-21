import React from 'react';
import { render, screen } from '@testing-library/react';

import { RadioGroup } from './Group';

describe('Group', () => {
  test('myProp should add myClass', (): void => {
    render(<RadioGroup myProp>test text</RadioGroup>);
    expect(screen.getByText('test text')).toHaveClass('myClass');
  });
});
