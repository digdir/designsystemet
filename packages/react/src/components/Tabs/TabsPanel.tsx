import type { UHTMLTabPanelElement } from '@u-elements/u-tabs';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import '@u-elements/u-tabs';

export type TabsPanelProps = HTMLAttributes<UHTMLTabPanelElement>;

/**
 * A single content item in a Tabs component.
 * @example
 * ```tsx
 * <Tabs.Panel value='1'>content 1</Tabs.Panel>
 * ```
 */
export const TabsPanel = forwardRef<UHTMLTabPanelElement, TabsPanelProps>(
  function TabsPanel({ className, ...rest }, ref) {
    return (
      <u-tabpanel class={cl('ds-tabs__panel', className)} ref={ref} {...rest} />
    );
  },
);
