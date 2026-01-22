import type { DSTabElement } from '@digdir/designsystemet-web';
import type { HTMLAttributes } from 'react';
import '@digdir/designsystemet-web'; // Import ds-tab custom element
import { forwardRef, useContext } from 'react';
import { Context } from './tabs';

export type TabsTabProps = {
  /**
   * Unique value that will be set in the `Tabs` components state when the tab is activated
   */
  value: string;
} & Omit<HTMLAttributes<DSTabElement>, 'value'>;

/**
 * A single item in a Tabs component.
 *
 * @example
 * <TabsTab value='1'>Tab 1</TabsTab>
 */
export const TabsTab = forwardRef<DSTabElement, TabsTabProps>(function TabsTab(
  { value, className, onClick, ...rest },
  ref,
) {
  const { onChange, getPrefixedValue } = useContext(Context);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: ds-tabs IS interactive
    <ds-tab
      aria-controls={rest['aria-controls'] ?? getPrefixedValue?.(value)}
      data-value={value}
      ref={ref}
      suppressHydrationWarning // Since <ds-tablist> adds attributes
      onClick={(e: React.MouseEvent<DSTabElement>) => {
        if (e.isTrusted) onChange?.(value); // Only call onChange is user actually clicked, not when programmatically clicked/controlled
        onClick?.(e);
      }}
      class={className}
      {...rest}
    >
      {rest.children}
    </ds-tab>
  );
});
