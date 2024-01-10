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
} & React.HTMLAttributes<HTMLTableCellElement>;

const SORT_ICON = {
  ascending: <ChevronUpIcon />,
  descending: <ChevronDownIcon />,
};

export const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(
  (
    { sortable = false, sort, onSortClick, className, children, ...rest },
    ref,
  ) => {
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
        {sortable && (
          <button
            className={utilityClasses.focusable}
            onClick={onSortClick}
          >
            {children}
            {sort === 'ascending' || sort === 'descending' ? (
              SORT_ICON[sort]
            ) : (
              <ChevronUpDownIcon />
            )}
          </button>
        )}

        {!sortable && children}
      </th>
    );
  },
);
