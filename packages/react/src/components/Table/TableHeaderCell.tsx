import type { AriaAttributes } from 'react';
import { type MouseEvent, type ThHTMLAttributes, forwardRef } from 'react';

export type TableHeaderCellProps = {
  /**
   * If 'none' | 'ascending' | 'descending' | 'other' will add a button to the header cell and change aria-sort and icon
   * @default undefined
   */
  sort?: AriaAttributes['aria-sort'];
} & ThHTMLAttributes<HTMLTableCellElement>;

export const TableHeaderCell = forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(function TableHeaderCell({ sort, children, ...rest }, ref) {
  return (
    <th aria-sort={sort} ref={ref} {...rest}>
      {sort ? <button>{children}</button> : children}
    </th>
  );
});
