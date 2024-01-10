import React from 'react';
import { render, screen } from '@testing-library/react';

import { Table } from './Table';

describe('table', (): void => {
  it('should render table', (): void => {
    render(<Table />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
