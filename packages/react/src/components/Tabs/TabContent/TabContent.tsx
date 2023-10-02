import type { HTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';
import cn from 'classnames';

import { TabsContext } from '../Tabs';

import classes from './TabContent.module.css';

export type TabContentProps = {
  /** Value of the content to be dislpayed */
  value?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'value'>;

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
