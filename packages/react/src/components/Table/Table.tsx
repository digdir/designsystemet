import React, { useEffect, useId } from 'react';
import cl from 'clsx';
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
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
  const [sortedCell, setSortedCell] = React.useState<string | null>(null);

  console.log({ sortedCell });

  return (
    <TableContext.Provider value={{ size, sortedCell, setSortedCell }}>
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
  onSortChange?: (type: 'ascending' | 'descending' | null) => void;
} & React.HTMLAttributes<HTMLTableCellElement>;

export const TableHeaderCell = ({
  sortable = false,
  onSortChange,
  className,
  children,
  ...rest
}: TableHeaderCellProps) => {
  const sortId = useId();
  const { size, sortedCell, setSortedCell } = React.useContext(TableContext);

  const [sortOrder, setSortOrder] = React.useState<
    'ascending' | 'descending' | null
  >(null);

  const sortIcon = React.useMemo(() => {
    if (!sortable) return null;

    if (sortOrder === 'ascending') {
      return <ChevronUpIcon />;
    } else if (sortOrder === 'descending') {
      return <ChevronDownIcon />;
    }
    return <ChevronUpDownIcon />;
  }, [sortOrder, sortable]);

  useEffect(() => {
    if (sortedCell !== sortId) {
      setSortOrder(null);
    }
  }, [sortedCell, sortId]);

  const handleSortChange = React.useCallback(
    (type: 'ascending' | 'descending' | null) => {
      if (type === sortOrder) return;
      setSortOrder(type);
      onSortChange?.(type);
      setSortedCell(sortId);
    },
    [onSortChange, setSortedCell, sortId, sortOrder],
  );

  return (
    <Paragraph
      as='th'
      size={size}
      className={cl(
        sortable && classes.sortable,
        sortOrder && classes.sorted,
        classes.headerCell,
        className,
      )}
      {...rest}
    >
      {!sortable ? (
        children
      ) : (
        <button
          onClick={() => {
            if (sortable) {
              if (sortOrder === 'ascending') {
                handleSortChange('descending');
              } else if (sortOrder === 'descending') {
                handleSortChange(null);
                setSortedCell(null);
              } else {
                handleSortChange('ascending');
              }
            }
          }}
        >
          {children}
          {sortIcon}
        </button>
      )}
    </Paragraph>
  );
};

type TableContextType = {
  size: TableProps['size'];
  sortedCell?: string | null;
  setSortedCell: React.Dispatch<React.SetStateAction<string | null>>;
};

const TableContext = React.createContext<TableContextType>({
  size: 'medium',
  sortedCell: null,
  setSortedCell: () => {},
});
