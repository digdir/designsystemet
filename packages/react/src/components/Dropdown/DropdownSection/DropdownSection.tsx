import React from 'react';
import cn from 'classnames';

import classes from './DropdownSection.module.css';

export type DropdownSectionProps = React.HTMLAttributes<HTMLUListElement>;

export const DropdownSection = ({
  children,
  ...rest
}: DropdownSectionProps) => {
  return (
    <ul
      {...rest}
      className={cn(classes.section, rest.className)}
    >
      {children}
    </ul>
  );
};

DropdownSection.displayName = 'Dropdown.Section';
