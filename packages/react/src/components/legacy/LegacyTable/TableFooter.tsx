import type { HTMLProps } from 'react';
import React from 'react';
import cl from 'clsx';

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
        className={cl(classes.tableFooter, className)}
      >
        {children}
      </tfoot>
    </TableRowTypeContext.Provider>
  );
};
