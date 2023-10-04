import type { HTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';
import cn from 'classnames';

import { TabsContext } from '../Tabs';

import classes from './TabContent.module.css';

export type TabContentProps = {
  /** When this value is selected as the current state, render this `TabContent` component*/
  value: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'value'>;

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(
  ({ children, value, ...rest }, ref) => {
    const { value: tabsValue, size = 'medium' } = useContext(TabsContext);
    const active = value == tabsValue;
    const onlyText = typeof children === 'string';

    return (
      <>
        {active && (
          <div
            {...rest}
            className={cn(
              classes[size],
              classes.tabContent,
              onlyText && classes.onlyText,
              rest.className,
            )}
            ref={ref}
          >
            {children}
          </div>
        )}
      </>
    );
  },
);
