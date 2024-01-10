import React from 'react';
import cl from 'clsx';

import { Paragraph } from '../Typography';

import classes from './Table.module.css';
import { TableContext } from './Table';

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...rest }, ref) => {
    const { size } = React.useContext(TableContext);

    return (
      <Paragraph
        as='tr'
        size={size}
        className={cl(classes.row, className)}
        ref={ref}
        {...rest}
      >
        {children}
      </Paragraph>
    );
  },
);
