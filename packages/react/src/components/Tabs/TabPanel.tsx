import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';

import { Paragraph } from '../Typography';

import { TabsContext } from './Tabs';

export type TabPanelProps = {
  /** When this value is selected as the current state, render this `TabPanel` component*/
  value: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'value'>;

/**
 * A single content item in a Tabs component.
 * @example
 * ```tsx
 * <Tabs.Panel value='1'>content 1</Tabs.Panel>
 * ```
 */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  function TabPanel({ children, value, className, ...rest }, ref) {
    const { value: tabsValue, size } = useContext(TabsContext);
    const active = value === tabsValue;

    return (
      <>
        {active && (
          <Paragraph asChild variant='short' size={size}>
            <div
              className={cl('ds-tabs__panel', className)}
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
