import { forwardRef, type TdHTMLAttributes, useContext } from 'react';
import { ChartContext } from '../chart/chart-context';

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

/**
 * TableCell component, used to display the cells of a table. Renders a native HTML td element.
 *
 * @example
 * <TableCell>John</TableCell>
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(rest, ref) {
    const inChart = useContext(ChartContext);
    return (
      <td
        ref={ref}
        suppressHydrationWarning={inChart} // Only inside Chart, as always having it on hides wrong text for all tables. See chart-context.ts
        {...rest}
      />
    );
  },
);
