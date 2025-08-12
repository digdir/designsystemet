import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useId, useState } from 'react';
import { RovingFocusItem } from '../../utilities/roving-focus/roving-focus-item';
import { Context } from './tabs';

export type TabsTabProps = {
  /**
   * Unique value that will be set in the `Tabs` components state when the tab is activated
   */
  value: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'value'>;

/**
 * A single item in a Tabs component.
 *
 * @example
 * <TabsTab value='1'>Tab 1</TabsTab>
 */
export const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(
  function TabsTab({ value, id, onClick, ...rest }, ref) {
    const tabs = useContext(Context);
    const generatedId = useId();
    const buttonId = id ?? `tab-${generatedId}`;

    return (
      <RovingFocusItem value={value} {...rest} asChild>
        <button
          ref={ref}
          id={buttonId}
          aria-selected={tabs.value === value}
          data-value={value}
          role='tab'
          type='button'
          onClick={(e) => {
            tabs.onChange?.(value);
            onClick?.(e);
          }}
          aria-controls={tabs.panelButtonMap?.get(buttonId)}
          {...rest}
        />
      </RovingFocusItem>
    );
  },
);
