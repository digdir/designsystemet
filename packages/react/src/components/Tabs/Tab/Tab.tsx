import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { RovingTabindexItem } from '../../../utility-components/RovingTabIndex';
import { SvgIcon } from '../../SvgIcon';

import classes from './Tab.module.css';
import { useTabItem } from './useTab';

export type TabProps = {
  /** Value of the TabItem */
  value: string;
  /** Icon to display */
  icon?: React.ReactNode;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'value'>;

export const Tab = forwardRef<HTMLButtonElement, TabProps>((props, ref) => {
  const { children, className, icon, ...rest } = props;
  const { active, size = 'medium', ...useTabRest } = useTabItem(props);

  return (
    <RovingTabindexItem
      {...rest}
      {...useTabRest}
      as={'button'}
      className={cn(
        classes.tabItem,
        classes[size],
        active && classes.isActive,
        className,
      )}
      ref={ref}
    >
      {icon && (
        <SvgIcon
          svgIconComponent={icon}
          className={classes.icon}
        />
      )}
      {children}
    </RovingTabindexItem>
  );
});
