import type { AriaAttributes } from 'react';
import { forwardRef, type ThHTMLAttributes, useContext } from 'react';
import { ChartContext } from '../chart/chart-context';

export type TableHeaderCellProps = {
  /**
   * If 'none' | 'ascending' | 'descending' | 'other' will add a button to the header cell and change aria-sort and icon
   * @default undefined
   */
  sort?: AriaAttributes['aria-sort'];
} & ThHTMLAttributes<HTMLTableCellElement>;

/**
 * TableHeaderCell component, used to display the header cells of a table. Renders a native HTML th element.
 *
 * @example
 * <TableHeaderCell>Name</TableHeaderCell>
 */
export const TableHeaderCell = forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(function TableHeaderCell({ sort, children, ...rest }, ref) {
  const inChart = useContext(ChartContext);
  return (
    <th
      aria-sort={sort}
      ref={ref}
      suppressHydrationWarning={inChart} // Only inside Chart, as always having it on hides wrong text for all tables. See chart-context.ts
      {...rest}
    >
      {sort ? <button type='button'>{children}</button> : children}
    </th>
  );
});
