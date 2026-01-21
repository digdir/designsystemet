import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type TabsListProps = HTMLAttributes<HTMLDivElement>;

/**
 * The container for all `Tab` components.
 *
 * @example
 * <TabsList>
 *  <TabsTab value='1'>Tab 1</TabsTab>
 *  <TabsTab value='2'>Tab 2</TabsTab>
 * </TabsList>
 */
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ children, ...rest }, ref) {
    return (
      <ds-tablist ref={ref} {...rest}>
        {children}
      </ds-tablist>
    );
  },
);
