import type { UHTMLTabElement } from '@u-elements/u-tabs';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type TabsTabProps = HTMLAttributes<UHTMLTabElement>;

/**
 * A single item in a Tabs component.
 * @example
 * <Tabs.Tab value='1'>Tab 1</Tabs.Tab>
 */
export const TabsTab = forwardRef<UHTMLTabElement, TabsTabProps>(
  function TabsTab({ className, ...rest }, ref) {
    return <u-tab {...rest} class={className} ref={ref} />;
  },
);
