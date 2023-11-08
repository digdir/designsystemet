import React, { forwardRef, useContext } from 'react';
import cn from 'classnames';

import { Paragraph } from '../../Typography';
import { DropdownSizeContext } from '../DropdownContext';

import classes from './DropdownHeader.module.css';

export type DropdownHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownHeader = forwardRef<HTMLDivElement, DropdownHeaderProps>(
  ({ children, ...rest }, ref) => {
    const size = useContext(DropdownSizeContext);

    return (
      <Paragraph
        {...rest}
        ref={ref}
        as='h6'
        size={size}
        className={cn(classes.heading, rest.className)}
      >
        {children}
      </Paragraph>
    );
  },
);

DropdownHeader.displayName = 'Dropdown.Header';
