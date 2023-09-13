import React from 'react';
import { render, screen } from '@testing-library/react';

import { ToggleGroup } from './ToggleGroup';

describe('ToggleGroup', () => {
  test('myProp should add myClass', (): void => {
    render(<ToggleGroup myProp>test text</ToggleGroup>);
    expect(screen.getByText('test text')).toHaveClass('myClass');
  });
});
