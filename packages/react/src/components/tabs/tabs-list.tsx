import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import { RovingFocusRoot } from '../../utilities/roving-focus/roving-focus-root';
import { Context } from './tabs';

export type TabsListProps = HTMLAttributes<HTMLDivElement>;

/**
 * The container for all `Tab` components.
 *
 * @example
 * <TabsList>
 *  <TabsTab value='1'>Tab 1</TabsTab>
 *  <TabsTab value='2'>Tab 2</TabsTab>
 * </TabsList>
 */
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ children, ...rest }, ref) {
    const { value } = useContext(Context);

    return (
      <RovingFocusRoot
        role='tablist'
        activeValue={value}
        orientation='ambiguous'
        ref={ref}
        {...rest}
      >
        {children}
      </RovingFocusRoot>
    );
  },
);
