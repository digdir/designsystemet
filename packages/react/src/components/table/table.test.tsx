import { render, screen } from '@testing-library/react';
import {
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRow,
} from './';
import { Table } from './table';

const children = (
  <>
    <TableHead>
      <TableRow>
        <TableHeaderCell>Header 1</TableHeaderCell>
        <TableHeaderCell>Header 2</TableHeaderCell>
        <TableHeaderCell>Header 3</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Cell 1</TableCell>
        <TableCell>Cell 2</TableCell>
        <TableCell>Cell 3</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Cell 4</TableCell>
        <TableCell>Cell 5</TableCell>
        <TableCell>Cell 6</TableCell>
      </TableRow>
    </TableBody>
    <TableFoot>
      <TableRow>
        <TableCell>Footer 1</TableCell>
        <TableCell>Footer 2</TableCell>
        <TableCell>Footer 3</TableCell>
      </TableRow>
    </TableFoot>
  </>
);

describe('table', (): void => {
  it('should render table', (): void => {
    render(<Table />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render with children', (): void => {
    render(<Table>{children}</Table>);
    expect(screen.getByRole('table').querySelector('tr')).toBeInTheDocument();
  });
});
