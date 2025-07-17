import { forwardRef, type HTMLAttributes } from 'react';

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * TableBody component, used to display the body of a table. Renders a native HTML tbody element.
 *
 * @example
 * <TableBody>
 *   <TableRow>
 *     <TableCell>John</TableCell>
 *     <TableCell>25</TableCell>
 *   </TableRow>
 * </TableBody>
 */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody(rest, ref) {
    return <tbody ref={ref} {...rest} />;
  },
);
