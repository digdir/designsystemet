import type { HTMLAttributes } from 'react';
import {
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

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
  function TabsPanel({ children, value, id, ...rest }, ref) {
    const {
      value: tabsValue,
      tablistRef,
      setPanelButtonMap,
    } = useContext(Context);
    const generatedId = useId();
    const panelId = id ?? `tab-${generatedId}`;

    const [_tabId, setTabId] = useState<string | undefined>(undefined);

    const internalRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs([ref, internalRef]);

    /* get associated button */
    useEffect(() => {
      if (!tablistRef) return;

      const button = tablistRef.current?.querySelector(
        `[role="tab"][data-value="${value}"]`,
      );
      setTabId(button ? button.id : undefined);

      if (button) {
        setPanelButtonMap?.((prev) => new Map(prev).set(button.id, panelId));
      }
    }, [tablistRef]);

    return (
      <ds-tabpanel ref={mergedRef} id={panelId} {...rest}>
        {children}
      </ds-tabpanel>
    );
  },
);
