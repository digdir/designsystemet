import cl from 'clsx/lite';
import * as React from 'react';

export type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  TableHeadProps
>(({ className, children, ...rest }, ref) => {
  return (
    <thead ref={ref} className={cl('ds-table__head', className)} {...rest}>
      {children}
    </thead>
  );
});

TableHead.displayName = 'TableHead';
