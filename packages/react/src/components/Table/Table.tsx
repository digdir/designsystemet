import * as React from 'react';
import cl from 'clsx/lite';

import { Paragraph } from '../Typography';
import { getSize } from '../../utilities/getSize';

type OldTableSizes = 'small' | 'medium' | 'large';

export type TableProps = {
  /**
   * The size of the table
   * @default md
   * @note `small`, `medium`, `large` is deprecated
   */
  size?: 'sm' | 'md' | 'lg' | OldTableSizes;
  /**
   * If true, the table will have zebra striping
   * @default false
   */
  zebra?: boolean;
  /**
   * If true, the table will have a sticky header
   * @default false
   */
  stickyHeader?: boolean;
  /**
   * If true, the table will have a rounded border
   * @default false
   */
  border?: boolean;
} & Omit<React.TableHTMLAttributes<HTMLTableElement>, 'border'>;

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      zebra = false,
      stickyHeader = false,
      border = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const size = getSize(rest.size || 'md') as TableProps['size'];

    return (
      <Paragraph
        asChild
        size={size}
      >
        <table
          ref={ref}
          className={cl(
            'fds-table',
            `fds-table--${size}`,
            zebra && 'fds-table--zebra',
            stickyHeader && 'fds-table--sticky-header',
            border && 'fds-table--border',
            className,
          )}
          {...rest}
        >
          {children}
        </table>
      </Paragraph>
    );
  },
);

Table.displayName = 'Table';
