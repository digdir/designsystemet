import type { ButtonHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Button } from '../../Button';
import { RovingTabindexItem } from '../../../utility-components/RovingTabIndex';

import classes from './ToggleGroupItem.module.css';
import { useToggleGroupItem } from './useToggleGroupitem';

export type ToggleGroupItemProps = {
  /** The value of the ToggleGroupItem */
  value: string;
  /** Icon to be displayed on the ToggleGroupItem */
  icon?: React.ReactNode;
  /** The text to be displayed on the ToggleGroupItem */
  children: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'children'>;

export const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>((props, ref) => {
  const { children, icon, ...rest } = props;
  const { active, buttonProps } = useToggleGroupItem(props);
  return (
    <RovingTabindexItem
      {...rest}
      {...buttonProps}
      className={cn(
        !active && classes.notActive,
        classes.toggleGroupItem,
        rest.className,
      )}
      as={Button}
      value={rest.value}
      icon={icon}
      color='primary'
      variant={active ? 'filled' : 'quiet'}
      iconPlacement='left'
      ref={ref}
    >
      {children}
    </RovingTabindexItem>
  );
});
