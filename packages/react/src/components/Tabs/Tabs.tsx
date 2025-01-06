import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import type { Color } from '../../colors';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import '@u-elements/u-tabs';
import { useMergeRefs } from '@floating-ui/react';
import type { UHTMLTabsElement } from '@u-elements/u-tabs';

export type TabsProps = MergeRight<
  DefaultProps & HTMLAttributes<UHTMLTabsElement>,
  {
    /**
     * Specify which color palette to use. If left unspecified, the color is inherited from the nearest ancestor with data-color.
     */
    'data-color'?: Color;
    /**
     * Called when the selected tab changes.
     *
     * @param selectedIndex The index of the selected tab.
     */
    onChange?: (selectedIndex: number) => void;

    /**
     * The index of the selected tab.
     */
    selectedIndex?: number;
  }
>;

/**
 * Display a group of tabs that can be toggled between.
 * @example
 * ```tsx
 * <Tabs onChange={(value) => console.log(value)}>
 *   <Tabs.List>
 *     <Tabs.Tab>Tab 1</Tabs.Tab>
 *     <Tabs.Tab>Tab 2</Tabs.Tab>
 *     <Tabs.Tab>Tab 3</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel>content 1</Tabs.Panel>
 *   <Tabs.Panel>content 2</Tabs.Panel>
 *   <Tabs.Panel>content 3</Tabs.Panel>
 * </Tabs>
 * ```
 */
export const Tabs = forwardRef<UHTMLTabsElement, TabsProps>(function Tabs(
  { selectedIndex, onChange, className, ...rest },
  ref,
) {
  const internalRef = useRef<UHTMLTabsElement>(null);
  const mergedRefs = useMergeRefs([internalRef, ref]);

  useEffect(() => {
    if (!internalRef.current) return;

    const tablist = internalRef.current.tabList;

    if (!tablist) return;

    /* When a tab is selected, we can check internalRef.current.selectedIndex to get the new tab */
    const observer = new MutationObserver(() => {
      if (onChange && internalRef.current) {
        onChange(internalRef.current.selectedIndex);
      }
    });

    observer.observe(tablist, {
      attributes: true,
      attributeFilter: ['aria-selected'],
      subtree: true,
      childList: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [onChange, internalRef]);

  useEffect(() => {
    if (internalRef.current && selectedIndex !== undefined) {
      internalRef.current.selectedIndex = selectedIndex;
    }
  }, [selectedIndex, internalRef]);

  return <u-tabs class={cl('ds-tabs', className)} ref={mergedRefs} {...rest} />;
});
