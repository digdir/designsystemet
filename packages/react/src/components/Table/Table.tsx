import React from 'react';
import cl from 'clsx';

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

export type TableHeaderCellProps = React.HTMLAttributes<HTMLTableCellElement>;

export const TableHeaderCell = ({
  className,
  children,
  ...rest
}: TableHeaderCellProps) => {
  const { size } = React.useContext(TableContext);

  return (
    <Paragraph
      as='th'
      size={size}
      {...rest}
      className={cl(classes.headerCell, className)}
    >
      {children}
    </Paragraph>
  );
};

const TableContext = React.createContext<Pick<TableProps, 'size'>>({
  size: 'medium',
});
