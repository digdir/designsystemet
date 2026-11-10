import { forwardRef, type HTMLAttributes, useContext } from 'react';
import { ChartContext } from '../chart/chart-context';

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
    const inChart = useContext(ChartContext);
    return (
      <tbody
        ref={ref}
        suppressHydrationWarning={inChart} // Only inside Chart, as always having it on hides wrong text for all tables. See chart-context.ts
        {...rest}
      />
    );
  },
);
