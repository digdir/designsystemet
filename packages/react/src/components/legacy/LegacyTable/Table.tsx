import type { ReactNode, HTMLProps } from 'react';
import cl from 'clsx';

import classes from './Table.module.css';
import type { ChangeHandler, TableContextType } from './utils';
import { TableContext } from './utils';

export interface TableProps<T = unknown>
  extends Omit<HTMLProps<HTMLTableElement>, 'onChange'> {
  children?: ReactNode;
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
      className={cl(classes.table, className)}
    >
      <TableContext.Provider value={context}>{children}</TableContext.Provider>
    </table>
  );
}
