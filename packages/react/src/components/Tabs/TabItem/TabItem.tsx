// react component that takes a list of tabitems and selects one of them as active. uses the RovingTabindex pattern.

import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { RovingTabindexItem } from '../../../utility-components/RovingTabIndex';

import classes from './TabItem.module.css';

export type TabItemProps = {
  /** Description of what myProp does in the component */
  value?: string;
} & HTMLAttributes<HTMLDivElement>;

export const TabItem = forwardRef<HTMLDivElement, TabItemProps>(
  ({ children, ...rest }, ref) => {
    return (
      <RovingTabindexItem
        {...rest}
        className={cn(classes.tabItemList, rest.className)}
        ref={ref}
      >
        {children}
      </RovingTabindexItem>
    );
  },
);
