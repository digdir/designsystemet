import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';

import { RovingFocusRoot } from '../../utilities/RovingFocus';

import { TabsContext } from './Tabs';

/**
 * The container for all `Tab` components.
 * @example
 * ```tsx
 * <Tabs.List>
 *  <Tabs.Tab value='1'>Tab 1</Tabs.Tab>
 *  <Tabs.Tab value='2'>Tab 2</Tabs.Tab>
 * </Tabs.List>
 * ```
 */
export const TabList = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function TabList({ children, className, ...rest }, ref) {
  const { value } = useContext(TabsContext);

  return (
    <RovingFocusRoot
      role='tablist'
      activeValue={value}
      className={cl('ds-tabs__tablist', className)}
      orientation='ambiguous'
      ref={ref}
      {...rest}
    >
      {children}
    </RovingFocusRoot>
  );
});
