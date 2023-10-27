import React from 'react';
import { render, screen } from '@testing-library/react';

import { Spinner } from './Spinner';

describe('spinner', (): void => {
  it('should render with default medium size', (): void => {
    render(<Spinner title='Loading' />);
    expect(screen.getByTitle('Loading').parentElement).toHaveStyle({
      width: '40px',
    });
  });

  it('should render with title "loading', (): void => {
    render(<Spinner title='Loading' />);
    expect(screen.getByTitle('Loading')).toBeInTheDocument();
  });
});
