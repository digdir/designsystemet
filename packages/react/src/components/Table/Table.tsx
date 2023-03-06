import type { HTMLProps } from 'react';
import React from 'react';
import cn from 'classnames';

import classes from './Table.module.css';
import type { ChangeHandler, TableContextType } from './utils';
import { TableContext } from './utils';

export interface TableProps<T>
  extends Omit<HTMLProps<HTMLTableElement>, 'onChange'> {
  children?: React.ReactNode;
  selectRows?: boolean;
  onChange?: ChangeHandler<T>;
  selectedValue?: T;
}

export function Table<T>({
  children,
  selectRows = false,
  onChange,
  selectedValue,
  className,
  ...tableProps
}: TableProps<T>) {
  const context: TableContextType<T> = { selectRows, onChange, selectedValue };

  return (
    <table
      {...tableProps}
      className={cn(classes.table, className)}
    >
      <TableContext.Provider value={context}>{children}</TableContext.Provider>
    </table>
  );
}
