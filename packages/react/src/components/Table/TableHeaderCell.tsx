import type { AriaAttributes } from 'react';
import { type ThHTMLAttributes, forwardRef } from 'react';

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
 * <Table.HeaderCell>Name</Table.HeaderCell>
 */
export const TableHeaderCell = forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(function TableHeaderCell({ sort, children, ...rest }, ref) {
  return (
    <th aria-sort={sort} ref={ref} {...rest}>
      {sort ? <button type='button'>{children}</button> : children}
    </th>
  );
});
