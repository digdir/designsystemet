import type { HTMLProps } from 'react';
import React from 'react';
import cl from 'clsx';

import classes from './TableBody.module.css';
import { TableRowTypeContext } from './utils';

export interface TableBodyProps extends HTMLProps<HTMLTableSectionElement> {
  children?: React.ReactNode;
}

export const TableBody = ({
  children,
  className,
  ...tableBodyProps
}: TableBodyProps) => {
  const variantStandard = 'body';
  return (
    <TableRowTypeContext.Provider value={{ variantStandard }}>
      <tbody
        {...tableBodyProps}
        className={cl(classes.tableBody, className)}
      >
        {children}
      </tbody>
    </TableRowTypeContext.Provider>
  );
};
