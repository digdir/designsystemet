import { render, screen } from '@testing-library/react';
import { TableHeaderCell } from './';
import type { TableHeaderCellProps } from './table-header-cell';

const Comp = (args: Partial<TableHeaderCellProps>) => (
  <TableHeaderCell {...args}>Header 1</TableHeaderCell>
);

describe('table header cell', (): void => {
  it('should render table header cell', (): void => {
    render(<Comp />);
    expect(screen.getByRole('columnheader')).toBeInTheDocument();
  });

  it('should render table header cell with sort button', (): void => {
    render(<Comp sort='none' />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render table header cell with sort button with aria-sort', (): void => {
    render(<Comp sort='ascending' />);
    expect(screen.getByRole('columnheader')).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  });
});
