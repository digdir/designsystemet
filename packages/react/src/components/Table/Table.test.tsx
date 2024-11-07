import { render as renderRtl, screen } from '@testing-library/react';

import type { TableProps } from './Table';
import { Table } from './Table';

import {
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '.';

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

const render = (props: TableProps = {}) => {
  return renderRtl(<Table {...props} />);
};

describe('table', (): void => {
  it('should render table', (): void => {
    render();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render with children', (): void => {
    render({ children });
    expect(screen.getByRole('table').querySelector('tr')).toBeInTheDocument();
  });
});
