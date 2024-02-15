import * as React from 'react';
import cl from 'clsx';

import classes from './Table.module.css';

export type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  TableHeadProps
>(({ className, children, ...rest }, ref) => {
  return (
    <thead
      ref={ref}
      className={cl(classes.head, className)}
      {...rest}
    >
      {children}
    </thead>
  );
});

TableHead.displayName = 'TableHead';
