import type { DSTabListElement } from '@digdir/designsystemet-web';
import type { HTMLAttributes } from 'react';
import '@digdir/designsystemet-web'; // Import ds-tablist custom element
import { forwardRef } from 'react';

export type TabsListProps = HTMLAttributes<DSTabListElement>;

/**
 * The container for all `Tab` components.
 *
 * @example
 * <TabsList>
 *  <TabsTab value='1'>Tab 1</TabsTab>
 *  <TabsTab value='2'>Tab 2</TabsTab>
 * </TabsList>
 */
export const TabsList = forwardRef<DSTabListElement, TabsListProps>(
  function TabsList({ children, ...rest }, ref) {
    return (
      <ds-tablist
        suppressHydrationWarning // Since <ds-tablist> adds attributes
        ref={ref}
        {...rest}
      >
        {children}
      </ds-tablist>
    );
  },
);
