import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Paragraph } from '../../Typography';

import classes from './DropdownHeader.module.css';

export type DropdownHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownHeader = forwardRef<HTMLDivElement, DropdownHeaderProps>(
  ({ children, ...rest }, ref) => {
    return (
      <Paragraph
        {...rest}
        ref={ref}
        as='h6'
        size='small'
        className={cn(classes.heading, rest.className)}
      >
        {children}
      </Paragraph>
    );
  },
);

DropdownHeader.displayName = 'Dropdown.Header';
