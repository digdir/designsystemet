import React, { forwardRef, useContext } from 'react';
import cn from 'classnames';

import type { ButtonProps } from '../../Button';
import { Button } from '../../Button';
import type { OverridableComponent } from '../../../types/OverridableComponent';
import { DropdownContext } from '../DropdownContext';

import classes from './DropdownItem.module.css';

export type DropdownItemProps = React.HTMLAttributes<HTMLLIElement>;

export const DropdownItem: OverridableComponent<
  Omit<ButtonProps, 'variant' | 'size' | 'color' | 'fullWidth'>,
  HTMLButtonElement
> = forwardRef(({ children, ...rest }, ref) => {
  const menu = useContext(DropdownContext);

  return (
    <li>
      <Button
        {...rest}
        ref={ref}
        variant='tertiary'
        size={menu.size}
        fullWidth
        className={cn(classes.item, rest.className)}
        role='menuitem'
      >
        {children}
      </Button>
    </li>
  );
});

/* DropdownItem.displayName = 'Dropdown.Item'; */
