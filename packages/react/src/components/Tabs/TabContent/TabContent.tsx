import type { HTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';
import cn from 'classnames';

import { TabsContext } from '../Tabs';

import classes from './TabContent.module.css';

export type TabContentProps = {
  /** Description of what myProp does in the component */
  value?: string;
} & HTMLAttributes<HTMLDivElement>;

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(
  ({ children, value, ...rest }, ref) => {
    const tabs = useContext(TabsContext);
    const active = value == tabs.value;

    return (
      <>
        {active && (
          <div
            {...rest}
            className={cn(classes.tabContent, rest.className)}
            ref={ref}
          >
            {children}
          </div>
        )}
      </>
    );
  },
);
