import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';

import { Paragraph } from '../Typography';

import { Context } from './Tabs';

export type TabsPanelProps = {
  /** When this value is selected as the current state, render this `TabsPanel` component*/
  value: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'value'>;

/**
 * A single content item in a Tabs component.
 * @example
 * ```tsx
 * <Tabs.Panel value='1'>content 1</Tabs.Panel>
 * ```
 */
export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(
  function TabsPanel({ children, value, className, ...rest }, ref) {
    const { value: tabsValue, size } = useContext(Context);
    const active = value === tabsValue;

    return (
      <>
        {active && (
          <div className={cl('ds-tabs__panel', className)} ref={ref} {...rest}>
            {children}
          </div>
        )}
      </>
    );
  },
);
