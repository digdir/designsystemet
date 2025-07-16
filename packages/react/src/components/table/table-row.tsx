import { forwardRef, type HTMLAttributes } from 'react';

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

/**
 * TableRow component, used to display the rows of a table. Renders a native HTML tr element.
 *
 * @example
 * <TableRow>
 *   <TableCell>John</TableCell>
 *   <TableCell>25</TableCell>
 * </TableRow>
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(rest, ref) {
    return <tr ref={ref} {...rest} />;
  },
);
