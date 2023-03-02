import type { HTMLProps } from 'react';
import React from 'react';
import cn from 'classnames';

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
        className={cn(classes.tableBody, className)}
      >
        {children}
      </tbody>
    </TableRowTypeContext.Provider>
  );
};
