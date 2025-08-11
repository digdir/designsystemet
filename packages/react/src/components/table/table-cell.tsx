import { forwardRef, type TdHTMLAttributes } from 'react';

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

/**
 * TableCell component, used to display the cells of a table. Renders a native HTML td element.
 *
 * @example
 * <TableCell>John</TableCell>
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(rest, ref) {
    return <td ref={ref} {...rest} />;
  },
);
