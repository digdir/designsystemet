import * as React from 'react';
import cl from 'clsx/lite';

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <tr
        className={cl('ds-table__row', className)}
        ref={ref}
        {...rest}
      >
        {children}
      </tr>
    );
  },
);

TableRow.displayName = 'TableRow';
