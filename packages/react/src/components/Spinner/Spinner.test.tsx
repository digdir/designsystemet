import React from 'react';
import { render, screen } from '@testing-library/react';

import { Spinner } from './Spinner';

test('should render with title "loading"', (): void => {
  render(<Spinner title='Loading' />);
  expect(screen.getByTitle('Loading')).toBeInTheDocument();
});
