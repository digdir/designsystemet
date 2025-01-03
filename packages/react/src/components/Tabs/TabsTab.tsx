import type { UHTMLTabElement } from '@u-elements/u-tabs';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type TabsTabProps = {
  /**
   * Specify if the tab is selected.
   */
  'aria-selected'?: boolean;
} & HTMLAttributes<UHTMLTabElement>;

/**
 * A single item in a Tabs component.
 * @example
 * <Tabs.Tab value='1'>Tab 1</Tabs.Tab>
 */
export const TabsTab = forwardRef<UHTMLTabElement, TabsTabProps>(
  function TabsTab({ className, ...rest }, ref) {
    return <u-tab class={className} ref={ref} {...rest} />;
  },
);
