import type { ReactNode, HTMLProps } from 'react';
import cl from 'clsx';

import classes from './TableRow.module.css';
import { useTableContext, useTableRowTypeContext } from './utils';

export interface TableRowProps<T>
  extends Omit<
    HTMLProps<HTMLTableRowElement>,
    'onClick' | 'tabIndex' | 'onKeyUp'
  > {
  children?: ReactNode;
  rowData?: T;
}

export function TableRow<T>({
  children,
  rowData,
  className,
  ...tableRowProps
}: TableRowProps<T>) {
  const { variantStandard } = useTableRowTypeContext();
  const { onChange, selectedValue, selectRows } = useTableContext<T>();
  const handleClick = () => {
    if (
      onChange != undefined &&
      selectRows &&
      variantStandard === 'body' &&
      rowData
    ) {
      onChange({ selectedValue: rowData });
    }
  };
  const isSelected =
    selectRows &&
    typeof rowData !== 'undefined' &&
    JSON.stringify(rowData) === JSON.stringify(selectedValue); // Todo: Find a cleaner way to define a selected row.

  return (
    <tr
      {...tableRowProps}
      className={cl(
        classes.tableRow,
        {
          [classes.selected]: isSelected,
          [classes.body]:
            variantStandard === 'body' && selectRows && !isSelected,
        },
        className,
      )}
      onClick={handleClick}
    >
      {children}
    </tr>
  );
}
