import type { ReactNode, HTMLProps } from 'react';
import cl from 'clsx';

import classes from './TableHeader.module.css';
import { TableRowTypeContext } from './utils';

export interface TableHeaderProps extends HTMLProps<HTMLTableSectionElement> {
  children?: ReactNode;
}

export const TableHeader = ({
  children,
  className,
  ...tableHeaderProps
}: TableHeaderProps) => {
  const variantStandard = 'header';
  return (
    <TableRowTypeContext.Provider value={{ variantStandard }}>
      <thead
        {...tableHeaderProps}
        className={cl(classes.tableHeader, className)}
      >
        {children}
      </thead>
    </TableRowTypeContext.Provider>
  );
};
