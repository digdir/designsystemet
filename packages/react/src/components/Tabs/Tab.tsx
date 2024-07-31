import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';

import { RovingFocusItem } from '../../utilities/RovingFocus/RovingFocusItem';
import { Paragraph } from '../Typography';

import { useTabItem } from './useTab';

export type TabProps = {
  /** Value that will be set in the `Tabs` components state when the tab is activated */
  value: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'value'>;

/**
 * A single item in a Tabs component.
 * @example
 * <Tabs.Tab value='1'>Tab 1</Tabs.Tab>
 */
export const Tab = forwardRef<HTMLButtonElement, TabProps>((props, ref) => {
  const { children, className, ...rest } = props;
  const { size, ...useTabRest } = useTabItem(props);

  return (
    <RovingFocusItem {...rest} asChild>
      <Paragraph asChild variant='short' size={size}>
        <button
          {...useTabRest}
          type='button'
          className={cl('ds-tabs__tab', 'ds-focus', className)}
          ref={ref}
        >
          {children}
        </button>
      </Paragraph>
    </RovingFocusItem>
  );
});

Tab.displayName = 'Tab';
