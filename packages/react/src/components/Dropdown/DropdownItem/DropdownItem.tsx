import React, { forwardRef } from 'react';
import cn from 'classnames';

import type { ButtonProps } from '../../Button';
import { Button } from '../../Button';
import type { OverridableComponent } from '../../../types/OverridableComponent';

import classes from './DropdownItem.module.css';

export type DropdownItemProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownItem: OverridableComponent<
  Omit<ButtonProps, 'variant' | 'size' | 'color'>,
  HTMLButtonElement
> = forwardRef(({ children, ...rest }, ref) => {
  return (
    <Button
      {...rest}
      ref={ref}
      variant='tertiary'
      size='medium'
      className={cn(classes.item, rest.className)}
    >
      {children}
    </Button>
  );
});

/* DropdownItem.displayName = 'Dropdown.Item'; */
