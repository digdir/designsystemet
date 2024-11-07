import { Table as TableRoot } from './Table';
import type { TableProps } from './Table';
import { TableBody } from './TableBody';
import type { TableBodyProps } from './TableBody';
import { TableCell } from './TableCell';
import type { TableCellProps } from './TableCell';
import { TableFoot } from './TableFoot';
import type { TableFootProps } from './TableFoot';
import { TableHead } from './TableHead';
import type { TableHeadProps } from './TableHead';
import { TableHeaderCell } from './TableHeaderCell';
import type { TableHeaderCellProps } from './TableHeaderCell';
import { TableRow } from './TableRow';
import type { TableRowProps } from './TableRow';

const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  HeaderCell: TableHeaderCell,
  Foot: TableFoot,
});

Table.displayName = 'Table';
Table.Head.displayName = 'Table.Head';
Table.Body.displayName = 'Table.Body';
Table.Row.displayName = 'Table.Row';
Table.Cell.displayName = 'Table.Cell';
Table.HeaderCell.displayName = 'Table.HeaderCell';
Table.Foot.displayName = 'Table.Foot';

export {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableFoot,
};
export type {
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableHeaderCellProps,
  TableFootProps,
};
