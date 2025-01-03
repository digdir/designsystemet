import type { UHTMLTabPanelElement } from '@u-elements/u-tabs';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type TabsPanelProps = HTMLAttributes<UHTMLTabPanelElement>;

/**
 * A single content item in a Tabs component.
 * @example
 * ```tsx
 * <Tabs.Panel>content 1</Tabs.Panel>
 * ```
 */
export const TabsPanel = forwardRef<UHTMLTabPanelElement, TabsPanelProps>(
  function TabsPanel({ className, ...rest }, ref) {
    return <u-tabpanel class={className} ref={ref} {...rest} />;
  },
);
