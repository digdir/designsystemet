import cl from 'clsx/lite';
import * as React from 'react';

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
  /**
   * If true, the table will have a hover effect on rows
   * @default false
   */
  hover?: boolean;
} & Omit<React.TableHTMLAttributes<HTMLTableElement>, 'border'>;

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  function Table(
    {
      zebra = false,
      stickyHeader = false,
      border = false,
      hover = false,
      size = 'md',
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <Paragraph asChild size={size}>
        <table
          className={cl('ds-table', className)}
          data-border={border || undefined}
          data-hover={hover || undefined}
          data-size={size}
          data-sticky-header={stickyHeader || undefined}
          data-zebra={zebra || undefined}
          ref={ref}
          {...rest}
        >
          {children}
        </table>
      </Paragraph>
    );
  },
);
