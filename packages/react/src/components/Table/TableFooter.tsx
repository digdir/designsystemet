import type { HTMLProps } from 'react';
import React from 'react';
import cn from 'classnames';

import classes from './TableFooter.module.css';
import { TableRowTypeContext } from './utils';

export interface TableFooterProps extends HTMLProps<HTMLTableSectionElement> {
  children?: React.ReactNode;
}

export const TableFooter = ({
  children,
  className,
  ...tableFooterProps
}: TableFooterProps) => {
  const variantStandard = 'footer';
  return (
    <TableRowTypeContext.Provider value={{ variantStandard }}>
      <tfoot
        {...tableFooterProps}
        className={cn(classes.tableFooter, className)}
      >
        {children}
      </tfoot>
    </TableRowTypeContext.Provider>
  );
};
