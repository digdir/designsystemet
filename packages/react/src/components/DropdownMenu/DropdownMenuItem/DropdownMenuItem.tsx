import React, { forwardRef, useContext } from 'react';
import cl from 'clsx';

import type { ButtonProps } from '../../Button';
import { Button } from '../../Button';
import type { OverridableComponent } from '../../../types/OverridableComponent';
import { DropdownMenuContext } from '../DropdownMenu';

import classes from './DropdownMenuItem.module.css';

export type DropdownMenuItemProps = React.HTMLAttributes<HTMLLIElement>;

export const DropdownMenuItem: OverridableComponent<
  Omit<ButtonProps, 'variant' | 'size' | 'color' | 'fullWidth'>,
  HTMLButtonElement
> = forwardRef(({ children, ...rest }, ref) => {
  const menu = useContext(DropdownMenuContext);

  return (
    <li>
      <Button
        {...rest}
        ref={ref}
        variant='tertiary'
        size={menu.size}
        fullWidth
        className={cl(classes.item, rest.className)}
        role='menuitem'
      >
        {children}
      </Button>
    </li>
  );
});
