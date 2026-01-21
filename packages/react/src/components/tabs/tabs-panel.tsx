import type { HTMLAttributes } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { useMergeRefs } from '../../utilities/hooks';

export type TabsPanelProps = {
  /**
   * When this value is selected as the current state, render this `TabsPanel` component.
   * Must match the `value` of a `Tabs.Tab` component.
   */
  value: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'value'>;

/**
 * A single content item in a Tabs component.
 *
 * @example
 * <TabsPanel value='1'>content 1</TabsPanel>
 */
export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(
  function TabsPanel({ children, value, id, ...rest }, ref) {
    const [tabId, setTabId] = useState<string | undefined>(undefined);

    const internalRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs([ref, internalRef]);

    /* get associated button */
    useEffect(() => {
      const tabsElement = internalRef.current?.tabsElement;

      if (!tabsElement) return;

      const button = tabsElement.querySelector(`[data-value="${value}"]`);

      setTabId(
        button ? button.getAttribute('aria-controls') || undefined : undefined,
      );
    }, []);

    return (
      <ds-tabpanel ref={mergedRef} id={tabId} {...rest}>
        {children}
      </ds-tabpanel>
    );
  },
);
