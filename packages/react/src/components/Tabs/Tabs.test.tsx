import React from 'react';
import { render, screen } from '@testing-library/react';

import { Tabs } from './Tabs';

describe('Tabs', () => {
  test('myProp should add myClass', (): void => {
    render(<Tabs myProp>test text</Tabs>);
    expect(screen.getByText('test text')).toHaveClass('myClass');
  });
});
