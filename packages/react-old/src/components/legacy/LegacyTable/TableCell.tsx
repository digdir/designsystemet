import type { ReactNode, HTMLProps } from 'react';
import cl from 'clsx';

import classes from './TableCell.module.css';
import type { SortHandler, Variant, SortDirection } from './utils';
import { useTableRowTypeContext } from './utils';
import { SortIcon } from './SortIcon';

export interface TableCellProps
  extends Omit<HTMLProps<HTMLTableCellElement>, 'onChange'> {
  children?: ReactNode;
  variant?: string;
  onChange?: SortHandler;
  sortDirection?: SortDirection;
  radiobutton?: boolean;
}

export function TableCell({
  children,
  variant,
  onChange,
  sortDirection = 'notSortable',
  className,
  radiobutton = false, // Todo: This only sets a class, but relies on the consumer to provide the actual radiobutton. This should either be handled entirely within this component, or we should give this property a more generic name.
  ...tableCellProps
}: TableCellProps) {
  const { variantStandard } = useTableRowTypeContext();

  const isVariant = (checkIf: Variant): boolean => {
    if (variant === undefined) {
      return variantStandard === checkIf;
    }
    return variant === checkIf;
  };

  const handleChange = () => {
    if (
      onChange != undefined &&
      sortDirection != undefined &&
      sortDirection != 'notSortable'
    ) {
      // Todo: Here we rely on the consumer to sort the rows based on the sortDirection. We should handle this within the component, with an optional possibility to pass in a custom compare function.
      onChange({
        next: sortDirection === 'desc' ? 'asc' : 'desc',
        previous: sortDirection,
      });
    }
  };

  return (
    <>
      {isVariant('header') && (
        <TableHeaderCell
          useTd={!children}
          {...tableCellProps}
          className={cl(
            radiobutton
              ? classes.headerTableCellRadiobutton
              : classes.headerTableCell,
            className,
          )}
          aria-sort={
            sortDirection === 'asc'
              ? 'ascending'
              : sortDirection === 'desc'
              ? 'descending'
              : undefined
          }
        >
          <div
            className={cl(
              sortDirection != 'notSortable' && classes.containerSortable,
            )}
            onClick={() => handleChange()}
            onKeyUp={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                handleChange();
              }
            }}
            role={sortDirection != 'notSortable' ? 'button' : undefined}
            tabIndex={sortDirection != 'notSortable' ? 0 : undefined}
          >
            <div className={classes.input}>{children}</div>
            {sortDirection != 'notSortable' && (
              <SortIcon
                aria-label='Sortering' // Todo: Texts should be provided by the consumer
                data-testid='sort-icon'
                className={
                  sortDirection == 'notActive'
                    ? classes.icon
                    : sortDirection == 'asc'
                    ? classes.iconAsc
                    : classes.iconDesc
                }
              />
            )}
          </div>
        </TableHeaderCell>
      )}
      {isVariant('body') && (
        <td
          {...tableCellProps}
          className={cl(
            radiobutton
              ? classes.bodyTableCellRadiobutton
              : classes.bodyTableCell,
            className,
          )}
        >
          <div className={radiobutton ? classes.radioButton : classes.input}>
            {children}
          </div>
        </td>
      )}
      {isVariant('footer') && (
        <td
          {...tableCellProps}
          className={className}
        >
          <div className={classes.input}>{children}</div>
        </td>
      )}
    </>
  );
}

type TableHeaderCellProps = React.PropsWithChildren<{ useTd?: boolean }> &
  React.DetailedHTMLProps<
    React.TdHTMLAttributes<HTMLTableDataCellElement>,
    HTMLTableDataCellElement
  >;

/**
 * Table headers should not have empty cells, so we wrap the cell in this
 * component to conditionally render a td or th element. According to WCAG
 * rules, it's OK for a td element to be empty.
 * @see https://webaim.org/techniques/tables/data#th
 */
function TableHeaderCell({
  useTd = false,
  children,
  ...tableCellProps
}: TableHeaderCellProps) {
  if (useTd) {
    return <td {...tableCellProps}>{children}</td>;
  }
  return <th {...tableCellProps}>{children}</th>;
}
