import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from '@navikt/aksel-icons';
import type { AriaAttributes } from 'react';
import React from 'react';
import cl from 'clsx';

import utilityClasses from '../../utilities/utility.module.css';

import classes from './Table.module.css';

export type TableHeaderCellProps = {
  sortable?: boolean;
  /**
   * If true, the table will be sortable
   * @default false
   */
  sort?: AriaAttributes['aria-sort'];

  onSortClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  hideIcon?: boolean;
} & React.HTMLAttributes<HTMLTableCellElement>;

export const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(
  (
    {
      hideIcon = false,
      sortable = false,
      sort,
      onSortClick,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const sortIcon = React.useMemo(() => {
      if (sort === 'ascending') {
        return <ChevronUpIcon />;
      }
      if (sort === 'descending') {
        return <ChevronDownIcon />;
      }
      return <ChevronUpDownIcon />;
    }, [sort]);

    return (
      <th
        className={cl(
          sortable && classes.sortable,
          sort && classes.sorted,
          classes.headerCell,
          className,
        )}
        aria-sort={sort}
        ref={ref}
        {...rest}
      >
        {!sortable ? (
          children
        ) : (
          <button
            className={utilityClasses.focusable}
            onClick={onSortClick}
          >
            {children}
            {!hideIcon && sortIcon}
          </button>
        )}
      </th>
    );
  },
);
