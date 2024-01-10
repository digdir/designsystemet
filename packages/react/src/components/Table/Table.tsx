import React, { useEffect, useId } from 'react';
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
  const sortId = useId();
  const { size, sortedCell, setSortedCell } = React.useContext(TableContext);

  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc' | null>(null);

  const sortIcon = React.useMemo(() => {
    if (!sortable) return null;

    if (sortOrder === 'asc') {
      return <ArrowUpIcon />;
    } else if (sortOrder === 'desc') {
      return <ArrowDownIcon />;
    }
    return <ArrowsUpDownIcon />;
  }, [sortOrder, sortable]);

  // if another cell is sorted, reset this cell
  useEffect(() => {
    if (sortedCell !== sortId) {
      setSortOrder(null);
    }
  }, [sortedCell, sortId]);

  const handleSortChange = React.useCallback(
    (type: 'asc' | 'desc' | null) => {
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
      onClick={(e) => {
        if (sortable) {
          if (sortOrder === 'asc') {
            handleSortChange('desc');
          } else if (sortOrder === 'desc') {
            handleSortChange(null);
            setSortedCell(null);
          } else {
            handleSortChange('asc');
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
      {!sortable ? (
        children
      ) : (
        <button>
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
