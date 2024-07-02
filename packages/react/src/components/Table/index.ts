import { Table as TableRoot } from './Table';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { TableHeaderCell } from './TableHeaderCell';
import type { TableProps } from './Table';
import type { TableHeadProps } from './TableHead';
import type { TableBodyProps } from './TableBody';
import type { TableRowProps } from './TableRow';
import type { TableCellProps } from './TableCell';
import type { TableHeaderCellProps } from './TableHeaderCell';

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
