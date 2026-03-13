import type { DSTabElement } from '@digdir/designsystemet-web';
import type { HTMLAttributes, MouseEvent } from 'react';
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
  const { onChange, isSyncingControlledValue, getPrefixedValue } =
    useContext(Context);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: ds-tabs IS interactive
    <ds-tab
      aria-controls={rest['aria-controls'] ?? getPrefixedValue?.(value)}
      data-value={value}
      ref={ref}
      suppressHydrationWarning // Since <ds-tablist> adds attributes
      onClick={(e: MouseEvent<DSTabElement>) => {
        if (!isSyncingControlledValue?.()) onChange?.(value);
        onClick?.(e);
      }}
      class={className}
      {...rest}
    >
      {rest.children}
    </ds-tab>
  );
});
