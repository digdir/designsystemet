import { Slot } from '@radix-ui/react-slot';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import { RovingFocusRoot } from '../../utilities/roving-focus/roving-focus-root';
import { Context } from './tabs';

export type TabsListProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

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
  function TabsList({ asChild, ...rest }, ref) {
    const Component = asChild ? Slot : 'div';

    const { value } = useContext(Context);

    return (
      <RovingFocusRoot
        role='tablist'
        activeValue={value}
        orientation='ambiguous'
        ref={ref}
        asChild
        {...rest}
      >
        <Component {...rest} />
      </RovingFocusRoot>
    );
  },
);
