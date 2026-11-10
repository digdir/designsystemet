import { forwardRef, type HTMLAttributes, useContext } from 'react';
import { ChartContext } from '../chart/chart-context';

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
    const inChart = useContext(ChartContext);
    return (
      <tfoot
        ref={ref}
        suppressHydrationWarning={inChart} // Only inside Chart, as always having it on hides wrong text for all tables. See chart-context.ts
        {...rest}
      />
    );
  },
);
