import { forwardRef, type HTMLAttributes, useContext } from 'react';
import { ChartContext } from '../chart/chart-context';

export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * TableHead component, used to display the header of a table. Renders a native HTML thead element.
 *
 * @example
 * <TableHead>
 *   <TableRow>
 *     <TableHeaderCell>Name</TableHeaderCell>
 *     <TableHeaderCell>Age</TableHeaderCell>
 *   </TableRow>
 * </TableHead>
 */
export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHead(rest, ref) {
    const inChart = useContext(ChartContext);
    return (
      <thead
        ref={ref}
        suppressHydrationWarning={inChart} // Only inside Chart, as always having it on hides wrong text for all tables. See chart-context.ts
        {...rest}
      />
    );
  },
);
