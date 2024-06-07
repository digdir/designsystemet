import * as React from 'react';
import cl from 'clsx/lite';

import { Paragraph } from '../Typography';

export type TableProps = {
  /**
   * The size of the table
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
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
      size = 'md',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <Paragraph
        asChild
        size={size}
      >
        <table
          ref={ref}
          className={cl(
            'ds-table',
            `ds-table--${size}`,
            zebra && 'ds-table--zebra',
            stickyHeader && 'ds-table--sticky-header',
            border && 'ds-table--border',
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
