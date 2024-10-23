import type { UHTMLTabElement } from '@u-elements/u-tabs';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type TabsTabProps = {
  selected?: boolean;
} & HTMLAttributes<UHTMLTabElement>;

/**
 * A single item in a Tabs component.
 * @example
 * <Tabs.Tab>Tab 1</Tabs.Tab>
 */
export const TabsTab = forwardRef<UHTMLTabElement, TabsTabProps>(
  function TabsTab({ className, selected, ...rest }, ref) {
    return (
      <u-tab aria-selected={selected} {...rest} class={className} ref={ref} />
    );
  },
);
