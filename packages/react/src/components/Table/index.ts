import { Table as TableRoot } from './Table';
import type { TableProps } from './Table';
import { TableBody } from './TableBody';
import type { TableBodyProps } from './TableBody';
import { TableCell } from './TableCell';
import type { TableCellProps } from './TableCell';
import { TableHead } from './TableHead';
import type { TableHeadProps } from './TableHead';
import { TableHeaderCell } from './TableHeaderCell';
import type { TableHeaderCellProps } from './TableHeaderCell';
import { TableRow } from './TableRow';
import type { TableRowProps } from './TableRow';

type TableComponent = typeof TableRoot & {
  Head: typeof TableHead;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Cell: typeof TableCell;
  HeaderCell: typeof TableHeaderCell;
};

const Table = TableRoot as TableComponent;

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.HeaderCell = TableHeaderCell;

Table.displayName = 'Table';
Table.Head.displayName = 'Table.Head';
Table.Body.displayName = 'Table.Body';
Table.Row.displayName = 'Table.Row';
Table.Cell.displayName = 'Table.Cell';
Table.HeaderCell.displayName = 'Table.HeaderCell';

export { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell };
export type {
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableHeaderCellProps,
};
