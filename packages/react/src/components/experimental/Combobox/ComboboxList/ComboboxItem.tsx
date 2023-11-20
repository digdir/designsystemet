import React, { forwardRef } from 'react';
import { useId } from '@floating-ui/react';

import classes from './ComboboxItem.module.css';

interface ComboboxItemProps {
  children: React.ReactNode;
  active: boolean;
}

export const ComboboxItem = forwardRef<
  HTMLLIElement,
  ComboboxItemProps & React.HTMLProps<HTMLLIElement>
>(({ children, active, ...rest }, ref) => {
  const id = useId();
  return (
    <li
      ref={ref}
      role='option'
      id={id}
      aria-selected={active}
      {...rest}
      className={classes.item}
    >
      {children}
    </li>
  );
});
