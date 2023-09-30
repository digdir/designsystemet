// react component that takes a list of tabitems and selects one of them as active. uses the RovingTabindex pattern.

import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { RovingTabindexItem } from '../../../utility-components/RovingTabIndex';
import { SvgIcon } from '../../SvgIcon';

import classes from './TabItem.module.css';
import { useTabItem } from './useTabItem';

export type TabItemProps = {
  /** Description of what myProp does in the component */
  value: string;
  children?: string;
  icon?: React.ReactNode;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'children' | 'value'>;

export const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(
  (props, ref) => {
    const { children, className, icon, ...rest } = props;
    const { active, size = 'medium', buttonProps } = useTabItem(props);

    return (
      <RovingTabindexItem
        {...rest}
        {...buttonProps}
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
  },
);
