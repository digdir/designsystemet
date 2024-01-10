import React from 'react';
import cl from 'clsx';

import { Paragraph } from '../Typography';

import classes from './Table.module.css';

export type TableProps = {
  /**
   * If true, the table will have zebra striping
   * @default false
   */
  zebra?: boolean;
} & React.HTMLAttributes<HTMLTableElement>;

export const Table = ({
  zebra = false,
  className,
  children,
  ...rest
}: TableProps) => {
  return (
    <table
      className={cl(zebra && classes.zebra, classes.table, className)}
      {...rest}
    >
      {children}
    </table>
  );
};

export type TableHeadProps = {} & React.HTMLAttributes<HTMLTableSectionElement>;

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

export type TableBodyProps = {} & React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = ({ children, ...rest }: TableBodyProps) => {
  return <tbody {...rest}>{children}</tbody>;
};

export type TableRowProps = {} & React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = ({ children, ...rest }: TableRowProps) => {
  return <tr {...rest}>{children}</tr>;
};

export type TableCellProps = {} & React.HTMLAttributes<HTMLTableCellElement>;

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

export type TableHeaderCellProps =
  {} & React.HTMLAttributes<HTMLTableCellElement>;

export const TableHeaderCell = ({
  className,
  children,
  ...rest
}: TableHeaderCellProps) => {
  return (
    <Paragraph
      as='th'
      size='medium'
      {...rest}
      className={cl(classes.headerCell, className)}
    >
      {children}
    </Paragraph>
  );
};
