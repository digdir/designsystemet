// react component that takes a list of tabitems and selects one of them as active. uses the RovingTabindex pattern.

import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { RovingTabindexRoot } from '../../../utility-components/RovingTabIndex';

import classes from './TabItemList.module.css';

export type TabItemListProps = {
  /** Description of what myProp does in the component */
  value?: string;
  defaultValue?: string;
} & HTMLAttributes<HTMLDivElement>;

export const TabItemList = forwardRef<HTMLDivElement, TabItemListProps>(
  ({ children, ...rest }, ref) => {
    return (
      <RovingTabindexRoot
        {...rest}
        className={cn(classes.tabItemList, rest.className)}
        ref={ref}
      >
        {children}
      </RovingTabindexRoot>
    );
  },
);
