import React from 'react';
import cl from 'clsx';

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

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ zebra = false, size = 'medium', className, children, ...rest }, ref) => {
    return (
      <Paragraph
        as='table'
        ref={ref}
        size={size}
        className={cl(
          classes[size],
          zebra && classes.zebra,
          classes.table,
          className,
        )}
        {...rest}
      >
        {children}
      </Paragraph>
    );
  },
);
