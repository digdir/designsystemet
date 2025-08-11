import { forwardRef, type HTMLAttributes } from 'react';

export type TableFootProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * TableFoot component, used to display the footer of a table. Renders a native HTML tfoot element.
 *
 * @example
 * <TableFoot>
 *   <TableRow>
 *     <TableCell>Total</TableCell>
 *     <TableCell>2</TableCell>
 *   </TableRow>
 * </TableFoot>
 */
export const TableFoot = forwardRef<HTMLTableSectionElement, TableFootProps>(
  function TableFoot(rest, ref) {
    return <tfoot ref={ref} {...rest} />;
  },
);
