import React from 'react';
import cn from 'classnames';

import classes from './DropdownList.module.css';

export type DropdownListProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownList = ({ children, ...rest }: DropdownListProps) => {
  return (
    <div
      {...rest}
      className={cn(classes.list, rest.className)}
    >
      {children}
    </div>
  );
};

DropdownList.displayName = 'Dropdown.List';
