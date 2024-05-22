import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import cl from 'clsx/lite';

import { TabsContext } from '../Tabs';

export type TabContentProps = {
  /** When this value is selected as the current state, render this `TabContent` component*/
  value: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'value'>;

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(
  ({ children, value, className, ...rest }, ref) => {
    const { value: tabsValue } = useContext(TabsContext);
    const active = value == tabsValue;

    return (
      <>
        {active && (
          <div
            className={cl('fds-tabs__content', className)}
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
