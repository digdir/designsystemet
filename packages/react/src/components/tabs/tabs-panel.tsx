import type { DSTabPanelElement } from '@digdir/designsystemet-web';
import type { HTMLAttributes } from 'react';
import '@digdir/designsystemet-web'; // Import ds-tabpanel custom element
import { forwardRef, useContext } from 'react';
import { Context } from './tabs';

export type TabsPanelProps = {
  /**
   * When this value is selected as the current state, render this `TabsPanel` component.
   * Must match the `value` of a `Tabs.Tab` component.
   */
  value: string;
} & Omit<HTMLAttributes<DSTabPanelElement>, 'value'>;

/**
 * A single content item in a Tabs component.
 *
 * @example
 * <TabsPanel value='1'>content 1</TabsPanel>
 */
export const TabsPanel = forwardRef<DSTabPanelElement, TabsPanelProps>(
  function TabsPanel({ children, value, id, className, ...rest }, ref) {
    const { getPrefixedValue } = useContext(Context);

    return (
      <ds-tabpanel
        suppressHydrationWarning // Since <ds-tablist> adds attributes
        ref={ref}
        id={id ?? getPrefixedValue?.(value)}
        class={className}
        {...rest}
      >
        {children}
      </ds-tabpanel>
    );
  },
);
