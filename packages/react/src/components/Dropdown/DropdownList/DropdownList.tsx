import React from 'react';
import cn from 'classnames';

import classes from './DropdownList.module.css';

/* The `section` element does not have it's own type, so we use `HTMLElement` */
export type DropdownListProps = React.HTMLAttributes<HTMLElement>;

export const DropdownList = ({ children, ...rest }: DropdownListProps) => {
  return (
    <section
      {...rest}
      className={cn(classes.list, rest.className)}
    >
      {children}
    </section>
  );
};

DropdownList.displayName = 'Dropdown.List';
