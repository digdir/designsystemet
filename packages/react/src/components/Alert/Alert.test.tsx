import React from 'react';
import { render, screen } from '@testing-library/react';

import { Alert } from './Alert';

describe('Alert', () => {
  test('myProp should add myClass', (): void => {
    // render(<Alert severity='success'>test text</Alert>);
    // expect(screen.getByText('test text')).toHaveClass('success');
  });
});
