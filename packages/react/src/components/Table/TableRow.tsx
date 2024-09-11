import { type HTMLAttributes, forwardRef } from 'react';

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(rest, ref) {
    return <tr ref={ref} {...rest} />;
  },
);
