import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useId } from 'react';
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
  function TabsTab({ value, id, ...rest }, ref) {
    const tabs = useContext(Context);
    const generatedId = useId();
    const buttonId = id ?? `tab-${generatedId}`;

    return (
      <RovingFocusItem value={value} {...rest} asChild>
        <button
          {...rest}
          aria-selected={tabs.value === value}
          id={buttonId}
          onClick={() => tabs.onChange?.(value)}
          ref={ref}
          role='tab'
          type='button'
        />
      </RovingFocusItem>
    );
  },
);
