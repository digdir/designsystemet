import { type TdHTMLAttributes, forwardRef } from 'react';

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

/**
 * TableCell component, used to display the cells of a table. Renders a native HTML td element.
 *
 * @example
 * <Table.Cell>John</Table.Cell>
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(rest, ref) {
    return <td ref={ref} {...rest} />;
  },
);
