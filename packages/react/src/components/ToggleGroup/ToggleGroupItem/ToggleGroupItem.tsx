import type { ButtonHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Button } from '../../Button';

import classes from './ToggleGroupItem.module.css';
import { useToggleGroupItem } from './useToggleGroupitem';

export type ToggleGroupItemProps = {
  /** Description of what myProp does in the component */
  value: string;
  icon?: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>((props, ref) => {
  const { children, icon, ...rest } = props;
  const { active, buttonProps } = useToggleGroupItem(props);
  return (
    <Button
      {...rest}
      {...buttonProps}
      color='primary'
      variant={buttonProps?.variant}
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
});
