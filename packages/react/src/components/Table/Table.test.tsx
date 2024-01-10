import React from 'react';
import { render, screen } from '@testing-library/react';

import { Table } from './Table';

describe('table', (): void => {
  it('should render', (): void => {
    render(<Table />);
    expect(screen.getByText('Table')).toBeInTheDocument();
  });
});
