import type { TableProps } from './table';
import { Table as TableRoot } from './table';
import type { TableBodyProps } from './table-body';
import { TableBody } from './table-body';
import type { TableCellProps } from './table-cell';
import { TableCell } from './table-cell';
import type { TableFootProps } from './table-foot';
import { TableFoot } from './table-foot';
import type { TableHeadProps } from './table-head';
import { TableHead } from './table-head';
import type { TableHeaderCellProps } from './table-header-cell';
import { TableHeaderCell } from './table-header-cell';
import type { TableRowProps } from './table-row';
import { TableRow } from './table-row';

type Table = typeof TableRoot & {
  /**
   * TableHead component, used to display the header of a table. Renders a native HTML thead element.
   *
   * @example
   * <Table.Head>
   *   <Table.Row>
   *     <Table.HeaderCell>Name</Table.HeaderCell>
   *     <Table.HeaderCell>Age</Table.HeaderCell>
   *   </Table.Row>
   * </Table.Head>
   */
  Head: typeof TableHead;
  /**
   * Table.Body component, used to display the body of a table. Renders a native HTML tbody element.
   *
   * @example
   * <Table.Body>
   *   <Table.Row>
   *     <Table.Cell>John</Table.Cell>
   *     <Table.Cell>25</Table.Cell>
   *   </Table.Row>
   * </Table.Body>
   */
  Body: typeof TableBody;
  /**
   * Table.Row component, used to display the rows of a table. Renders a native HTML tr element.
   *
   * @example
   * <Table.Row>
   *   <Table.Cell>John</Table.Cell>
   *   <Table.Cell>25</Table.Cell>
   * </Table.Row>
   */
  Row: typeof TableRow;
  /**
   * Table.Cell component, used to display the cells of a table. Renders a native HTML td element.
   *
   * @example
   * <Table.Cell>John</Table.Cell>
   */
  Cell: typeof TableCell;
  /**
   * Table.HeaderCell component, used to display the header cells of a table. Renders a native HTML th element.
   *
   * @example
   * <Table.HeaderCell>Name</Table.HeaderCell>
   */
  HeaderCell: typeof TableHeaderCell;
  /**
   * Table.Foot component, used to display the footer of a table. Renders a native HTML tfoot element.
   *
   * @example
   * <Table.Foot>
   *   <Table.Row>
   *     <Table.Cell>Total</Table.Cell>
   *     <Table.Cell>2</Table.Cell>
   *   </Table.Row>
   * </Table.Foot>
   */
  Foot: typeof TableFoot;
};

/**
 * Table component, used to display tabular data. Renders a native HTML table element.
 *
 * @example
 * <Table>
 *   <Table.Head>
 *     <Table.Row>
 *       <Table.HeaderCell>Name</Table.HeaderCell>
 *       <Table.HeaderCell>Age</Table.HeaderCell>
 *     </Table.Row>
 *   </Table.Head>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>John</Table.Cell>
 *       <Table.Cell>25</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 *   <Table.Foot>
 *     <Table.Row>
 *       <Table.Cell>Total</Table.Cell>
 *       <Table.Cell>2</Table.Cell>
 *     </Table.Row>
 *   </Table.Foot>
 * </Table>
 */
const TableComponent: Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  HeaderCell: TableHeaderCell,
  Foot: TableFoot,
});

TableComponent.displayName = 'Table';
TableComponent.Head.displayName = 'Table.Head';
TableComponent.Body.displayName = 'Table.Body';
TableComponent.Row.displayName = 'Table.Row';
TableComponent.Cell.displayName = 'Table.Cell';
TableComponent.HeaderCell.displayName = 'Table.HeaderCell';
TableComponent.Foot.displayName = 'Table.Foot';

export {
  TableComponent as Table,
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
