import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from '@navikt/aksel-icons';
import type { AriaAttributes } from 'react';
import * as React from 'react';
import cl from 'clsx/lite';

const SORT_ICON = {
  ascending: <ChevronUpIcon />,
  descending: <ChevronDownIcon />,
};

export type TableHeaderCellProps = {
  /**
   * If true, will add a button to the header cell
   * @default false
   */
  sortable?: boolean;
  /**
   * If true, will change aria-sort and icon
   * @default undefined
   */
  sort?: AriaAttributes['aria-sort'];
  /**
   * Callback for when the sort button is clicked
   * @default undefined
   */
  onSortClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & React.ThHTMLAttributes<HTMLTableCellElement>;

export const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(
  (
    { sortable = false, sort, onSortClick, className, children, ...rest },
    ref,
  ) => {
    const sortIcon =
      sort === 'ascending' || sort === 'descending' ? (
        SORT_ICON[sort]
      ) : (
        <ChevronUpDownIcon />
      );

    return (
      <th
        className={cl(
          'fds-table__header__cell',
          sortable && 'fds-table__header__cell--sortable',
          sort && `fds-table__header__cell--sorted`,
          className,
        )}
        aria-sort={sort}
        ref={ref}
        {...rest}
      >
        {sortable && (
          <button
            className={`fds-focus`}
            onClick={onSortClick}
          >
            {children}
            {sortIcon}
          </button>
        )}

        {!sortable && children}
      </th>
    );
  },
);

TableHeaderCell.displayName = 'TableHeaderCell';
