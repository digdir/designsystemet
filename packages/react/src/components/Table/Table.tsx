import React from 'react';

export type TableProps = {} & React.HTMLAttributes<HTMLTableElement>;

export const Table = ({ children, ...rest }: TableProps) => {
  return <table {...rest}>{children}</table>;
};

export type TableHeadProps = {} & React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHead = ({ children, ...rest }: TableHeadProps) => {
  return <thead {...rest}>{children}</thead>;
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

export const TableCell = ({ children, ...rest }: TableCellProps) => {
  return <td {...rest}>{children}</td>;
};

export type TableHeaderCellProps =
  {} & React.HTMLAttributes<HTMLTableCellElement>;

export const TableHeaderCell = ({
  children,
  ...rest
}: TableHeaderCellProps) => {
  return <th {...rest}>{children}</th>;
};
