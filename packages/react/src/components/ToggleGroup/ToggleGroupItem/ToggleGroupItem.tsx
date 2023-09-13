import type { ButtonHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Button } from '../../Button';

import classes from './ToggleGroupItem.module.css';

type ButtonVariant = Parameters<typeof Button>[0]['variant'];

export type ToggleGroupProps = {
  /** Description of what myProp does in the component */
  active: boolean;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupProps>(
  ({ active, variant, icon, children, ...rest }, ref) => {
    return (
      <Button
        {...rest}
        color='primary'
        variant={variant}
        iconPlacement='left'
        icon={icon}
        className={cn(classes.notActive, rest.className)}
        ref={ref}
        aria-current={active}
        role='radio'
      >
        {children}
      </Button>
    );
  },
);
