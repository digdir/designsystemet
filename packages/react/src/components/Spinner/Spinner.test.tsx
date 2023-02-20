import React from 'react';
import { render, screen } from '@testing-library/react';

import { Spinner } from './Spinner';

test('should have aria-live and aria-busy', () => {
  render(<Spinner screenReaderLabel='Loading' />);
  const spinnerContainer = screen.getByTestId('spinner-container');
  expect(spinnerContainer).toHaveAttribute('aria-live', 'polite');
  expect(spinnerContainer).toHaveAttribute('aria-busy', 'true');
});

test('should render with title "loading"', (): void => {
  render(<Spinner screenReaderLabel='Loading' />);
  expect(screen.getByTitle('Loading')).toBeInTheDocument();
});
