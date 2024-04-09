import * as React from 'react';
import cl from 'clsx';

import classes from './Table.module.css';

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <td
        ref={ref}
        className={cl(classes.cell, className)}
        {...rest}
      >
        {children}
      </td>
    );
  },
);

TableCell.displayName = 'TableCell';
