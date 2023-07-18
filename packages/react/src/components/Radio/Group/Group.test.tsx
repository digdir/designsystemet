import React from 'react';
import { render, screen } from '@testing-library/react';

import { Group } from './Group';

describe('Group', () => {
  test('myProp should add myClass', (): void => {
    render(<Group myProp>test text</Group>);
    expect(screen.getByText('test text')).toHaveClass('myClass');
  });
});
