import React from 'react';
import cl from 'clsx';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsUpDownIcon,
} from '@navikt/aksel-icons';

import { Paragraph } from '../Typography';

import classes from './Table.module.css';

export type TableProps = {
  /**
   * The size of the table
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If true, the table will have zebra striping
   * @default false
   */
  zebra?: boolean;
} & React.HTMLAttributes<HTMLTableElement>;

export const Table = ({
  zebra = false,
  size = 'medium',
  className,
  children,
  ...rest
}: TableProps) => {
  return (
    <TableContext.Provider value={{ size }}>
      <table
        className={cl(
          classes[size],
          zebra && classes.zebra,
          classes.table,
          className,
        )}
        {...rest}
      >
        {children}
      </table>
    </TableContext.Provider>
  );
};

export type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHead = ({ className, children, ...rest }: TableHeadProps) => {
  return (
    <thead
      className={cl(classes.head, className)}
      {...rest}
    >
      {children}
    </thead>
  );
};

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = ({ children, ...rest }: TableBodyProps) => {
  return <tbody {...rest}>{children}</tbody>;
};

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = ({ className, children, ...rest }: TableRowProps) => {
  const { size } = React.useContext(TableContext);

  return (
    <Paragraph
      as='tr'
      size={size}
      className={cl(classes.row, className)}
      {...rest}
    >
      {children}
    </Paragraph>
  );
};

export type TableCellProps = React.HTMLAttributes<HTMLTableCellElement>;

export const TableCell = ({ className, children, ...rest }: TableCellProps) => {
  return (
    <td
      className={cl(classes.cell, className)}
      {...rest}
    >
      {children}
    </td>
  );
};

export type TableHeaderCellProps = {
  /**
   * If true, the table will be sortable
   * @default false
   */
  sortable?: boolean;
  /**
   * Callback for when the sort order changes
   */
  onSortChange?: (type: 'asc' | 'desc' | null) => void;
} & React.HTMLAttributes<HTMLTableCellElement>;

export const TableHeaderCell = ({
  sortable = false,
  onSortChange,
  onClick,
  className,
  children,
  ...rest
}: TableHeaderCellProps) => {
  const { size } = React.useContext(TableContext);

  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc' | null>(null);

  const sortIcon = React.useMemo(() => {
    if (!sortable) return null;

    if (sortOrder === 'asc') {
      return <ArrowDownIcon />;
    } else if (sortOrder === 'desc') {
      return <ArrowUpIcon />;
    }
    return <ArrowsUpDownIcon />;
  }, [sortOrder, sortable]);

  return (
    <Paragraph
      as='th'
      size={size}
      onClick={(e) => {
        if (sortable) {
          if (sortOrder === 'asc') {
            setSortOrder('desc');
            onSortChange?.('desc');
          } else if (sortOrder === 'desc') {
            setSortOrder(null);
            onSortChange?.(null);
          } else {
            setSortOrder('asc');
            onSortChange?.('asc');
          }
        }
        // @ts-expect-error #2740 - We get the wrong type for onClick
        onClick?.(e);
      }}
      className={cl(
        sortable && classes.sortable,
        classes.headerCell,
        className,
      )}
      {...rest}
    >
      {children}
      {sortIcon}
    </Paragraph>
  );
};

const TableContext = React.createContext<Pick<TableProps, 'size'>>({
  size: 'medium',
});
