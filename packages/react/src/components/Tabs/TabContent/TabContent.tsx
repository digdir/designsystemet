import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import cl from 'clsx';

import { TabsContext } from '../Tabs';

import classes from './TabContent.module.css';

export type TabContentProps = {
  /** When this value is selected as the current state, render this `TabContent` component*/
  value: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'value'>;

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(
  ({ children, value, className, ...rest }, ref) => {
    const { value: tabsValue, size = 'medium' } = useContext(TabsContext);
    const active = value == tabsValue;
    const onlyText = typeof children === 'string';

    return (
      <>
        {active && (
          <div
            className={cl(
              classes[size],
              classes.tabContent,
              onlyText && classes.onlyText,
              className,
            )}
            ref={ref}
            {...rest}
          >
            {children}
          </div>
        )}
      </>
    );
  },
);

TabContent.displayName = 'TabContent';
