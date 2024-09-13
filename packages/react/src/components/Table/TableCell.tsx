import { type TdHTMLAttributes, forwardRef } from 'react';

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(rest, ref) {
    return <td ref={ref} {...rest} />;
  },
);
