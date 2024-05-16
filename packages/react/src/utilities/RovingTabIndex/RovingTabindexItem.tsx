// Logic from: https://www.joshuawootonn.com/react-roving-tabindex
// Inspired by: https://github.com/radix-ui/primitives/tree/main/packages/react/roving-focus/src

import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';

import type { RovingTabindexElement } from './RovingTabindexRoot';

import { useRovingTabindex } from '.';

type RovingTabindexItemProps = {
  /** The value of the `RovingTabindexItem` used to determine which item should have focus. */
  value?: string;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLElement>;

/** Get the next focusable RovingTabindexItem */
export function getNextFocusableValue(
  items: RovingTabindexElement[],
  value: string,
): RovingTabindexElement | undefined {
  const currIndex = items.findIndex((item) => item.value === value);
  return items.at(currIndex === items.length - 1 ? 0 : currIndex + 1);
}

/** Get the previous focusable RovingTabindexItem */
export function getPrevFocusableValue(
  items: RovingTabindexElement[],
  value: string,
): RovingTabindexElement | undefined {
  const currIndex = items.findIndex((item) => item.value === value);
  return items.at(currIndex === 0 ? -1 : currIndex - 1);
}

export const RovingTabindexItem = forwardRef<
  HTMLElement,
  RovingTabindexItemProps
>(({ value, asChild, ...rest }, ref) => {
  const Component = asChild ? Slot : 'div';

  const focusValue =
    value ?? (typeof rest.children == 'string' ? rest.children : '');

  const { getOrderedItems, getRovingProps } = useRovingTabindex(focusValue);

  const rovingProps = getRovingProps<HTMLElement>({
    onKeyDown: (e) => {
      rest?.onKeyDown?.(e);
      const items = getOrderedItems();
      let nextItem: RovingTabindexElement | undefined;

      if (e.key === 'ArrowRight') {
        nextItem = getNextFocusableValue(items, focusValue);
      }

      if (e.key === 'ArrowLeft') {
        nextItem = getPrevFocusableValue(items, focusValue);
      }

      nextItem?.element.focus();
    },
  });

  const mergedRefs = useMergeRefs([ref, rovingProps.ref]);

  return (
    <Component
      {...rest}
      {...rovingProps}
      ref={mergedRefs}
    >
      {rest.children}
    </Component>
  );
});
