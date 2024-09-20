import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useId } from 'react';

import { RovingFocusItem } from '../../utilities/RovingFocus/RovingFocusItem';
import { Paragraph } from '../Typography';
import { Context } from './Tabs';

export type TabsTabProps = {
  /** Value that will be set in the `Tabs` components state when the tab is activated */
  value: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'value'>;

/**
 * A single item in a Tabs component.
 * @example
 * <Tabs.Tab value='1'>Tab 1</Tabs.Tab>
 */
export const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(
  function TabsTab({ className, value, ...rest }, ref) {
    const tabs = useContext(Context);
    const buttonId = `tab-${useId()}`;

    return (
      <RovingFocusItem value={value} {...rest} asChild>
        <Paragraph asChild variant='short' size={tabs.size}>
          <button
            {...rest}
            aria-selected={tabs.value === value}
            className={cl('ds-tabs__tab', className)}
            id={buttonId}
            onClick={() => tabs.onChange?.(value)}
            ref={ref}
            role='tab'
            type='button'
          />
        </Paragraph>
      </RovingFocusItem>
    );
  },
);
