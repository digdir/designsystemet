import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';

import { useMergeRefs } from '../../utilities/hooks';
import { Context } from './tabs';

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
  function TabsPanel({ children, value, ...rest }, ref) {
    const { value: tabsValue } = useContext(Context);
    const active = value === tabsValue;

    const [hasTabbableElement, setHasTabbableElement] = useState(false);
    const [labelledBy, setLabelledBy] = useState<string | undefined>(undefined);

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

    /* get associated button */
    useEffect(() => {
      if (!internalRef.current) return;
      const parent = internalRef.current.parentElement;
      if (parent) {
        const button = parent.querySelector(
          `[role="tab"][data-value="${value}"]`,
        );
        setLabelledBy(button ? button.id : undefined);
      }
    }, [internalRef]);

    return (
      <div
        ref={mergedRef}
        role='tabpanel'
        tabIndex={hasTabbableElement ? undefined : 0}
        aria-labelledby={labelledBy}
        hidden={!active}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
