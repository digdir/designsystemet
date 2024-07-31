import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import cl from 'clsx/lite';

import { Paragraph } from '../Typography';

import { TabsContext } from './TabsRoot';

export type TabContentProps = {
  /** When this value is selected as the current state, render this `TabContent` component*/
  value: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'value'>;

/**
 * A single content item in a Tabs component.
 * @example
 * ```tsx
 * <Tabs.Content value='1'>content 1</Tabs.Content>
 * ```
 */
export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(
  ({ children, value, className, ...rest }, ref) => {
    const { value: tabsValue, size } = useContext(TabsContext);
    const active = value == tabsValue;

    return (
      <>
        {active && (
          <Paragraph asChild variant='short' size={size}>
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
