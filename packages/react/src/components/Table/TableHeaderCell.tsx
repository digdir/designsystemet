import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from '@navikt/aksel-icons';
import React, { useEffect, useId } from 'react';
import cl from 'clsx';

import { Paragraph } from '../Typography';
import utilityClasses from '../../utilities/utility.module.css';

import { TableContext } from './Table';
import classes from './Table.module.css';

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

export const TableHeaderCell = React.forwardRef<
  HTMLTableHeaderCellElement,
  TableHeaderCellProps
>(({ sortable = false, onSortChange, className, children, ...rest }, ref) => {
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
      aria-sort={!sortable ? undefined : sortOrder ? sortOrder : 'none'}
      ref={ref}
      {...rest}
    >
      {!sortable ? (
        children
      ) : (
        <button
          className={utilityClasses.focusable}
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
});
