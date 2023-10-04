import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { RovingTabindexItem } from '../../../utility-components/RovingTabIndex';
import utilityClasses from '../../../utils/utility.module.css';

import classes from './Tab.module.css';
import { useTabItem } from './useTab';

export type TabProps = {
  /** Value that will be set in the `Tabs` components state when the tab is activated*/
  value: string;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Title of icon for screen readers */
  iconTitle?: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'value'>;

export const Tab = forwardRef<HTMLButtonElement, TabProps>((props, ref) => {
  const { children, className, icon, iconTitle, ...rest } = props;
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
      {icon && <span className={classes.icon}>{icon}</span>}
      {iconTitle && (
        <span className={utilityClasses.visuallyHidden}>{iconTitle}</span>
      )}
      {children}
    </RovingTabindexItem>
  );
});
