import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';

import { useMergeRefs } from '../../utilities/hooks';
import { Context } from './Tabs';

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
 * <Tabs.Panel value='1'>content 1</Tabs.Panel>
 */
export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(
  function TabsPanel({ children, value, ...rest }, ref) {
    const { value: tabsValue } = useContext(Context);
    const active = value === tabsValue;

    const [hasTabbableElement, setHasTabbableElement] = useState(false);

    const internalRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs([ref, internalRef]);

    /* Check if the panel has any tabbable elements */
    useEffect(() => {
      if (!internalRef.current) return;
      const tabbableElements = internalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      setHasTabbableElement(tabbableElements.length > 0);
    }, [children]);

    return (
      <>
        {active && (
          <div
            ref={mergedRef}
            role='tabpanel'
            tabIndex={hasTabbableElement ? undefined : 0}
            {...rest}
          >
            {children}
          </div>
        )}
      </>
    );
  },
);
