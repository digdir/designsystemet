import React from 'react';
import { render, screen } from '@testing-library/react';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  test('myProp should add myClass', (): void => {
    render(<Pagination myProp>test text</Pagination>);
    expect(screen.getByText('test text')).toHaveClass('myClass');
  });
});
