import { forwardRef, type HTMLAttributes, useContext } from 'react';
import { ChartContext } from '../chart/chart-context';

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
    const inChart = useContext(ChartContext);
    return (
      <tr
        ref={ref}
        suppressHydrationWarning={inChart} // Only inside Chart, as always having it on hides wrong text for all tables. See chart-context.ts
        {...rest}
      />
    );
  },
);
