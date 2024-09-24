import type { UHTMLTabListElement } from '@u-elements/u-tabs';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import '@u-elements/u-tabs';

export type TabsListProps = HTMLAttributes<UHTMLTabListElement>;

/**
 * The container for all `Tab` components.
 * @example
 * ```tsx
 * <Tabs.List>
 *  <Tabs.Tab value='1'>Tab 1</Tabs.Tab>
 *  <Tabs.Tab value='2'>Tab 2</Tabs.Tab>
 * </Tabs.List>
 * ```
 */
export const TabsList = forwardRef<UHTMLTabListElement, TabsListProps>(
  function TabsList({ className, ...rest }, ref) {
    return (
      <u-tablist
        class={cl('ds-tabs__tablist', className)}
        ref={ref}
        {...rest}
      />
    );
  },
);
