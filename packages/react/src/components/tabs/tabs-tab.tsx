import type { DSTabElement } from '@digdir/designsystemet-web';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useId, useRef } from 'react';
import { useMergeRefs } from '../../utilities/hooks';
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
  { value, id, onClick, ...rest },
  ref,
) {
  const tabs = useContext(Context);
  const localRef = useRef(null);
  const generatedId = useId();
  const buttonId = id ?? `tab-${generatedId}`;

  const mergedRefs = useMergeRefs([ref, localRef]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: ds-tabs IS interactive
    <ds-tab
      ref={mergedRefs}
      onClick={(e: React.MouseEvent<DSTabElement>) => {
        tabs.onChange?.(value);
        onClick?.(e);
      }}
      aria-controls={value ? buttonId : undefined}
      data-value={value}
      {...rest}
    >
      {rest.children}
    </ds-tab>
  );
});
