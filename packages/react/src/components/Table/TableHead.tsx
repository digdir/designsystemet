import * as React from 'react';
import cl from 'clsx/lite';

export type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  TableHeadProps
>(({ className, children, ...rest }, ref) => {
  return (
    <thead
      ref={ref}
      className={cl('fds-table__head', className)}
      {...rest}
    >
      {children}
    </thead>
  );
});

TableHead.displayName = 'TableHead';
