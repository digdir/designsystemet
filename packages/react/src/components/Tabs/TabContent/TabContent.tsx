import type { HTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';

import { TabsContext } from '../Tabs';

export type TabContentProps = {
  /** When this value is selected as the current state, render this `TabContent` component*/
  value: string;
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
            ref={ref}
          >
            {children}
          </div>
        )}
      </>
    );
  },
);
