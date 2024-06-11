import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import cl from 'clsx/lite';

import { Paragraph } from '../Typography';

import { TabsContext } from './Tabs';

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
          <Paragraph asChild>
            <div
              className={cl('ds-tabs__content', className)}
              ref={ref}
              {...rest}
            >
              {children}
            </div>
          </Paragraph>
        )}
      </>
    );
  },
);

TabContent.displayName = 'TabContent';
