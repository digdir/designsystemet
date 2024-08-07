// Logic from: https://www.joshuawootonn.com/react-roving-tabindex
// Inspired by: https://github.com/radix-ui/primitives/tree/main/packages/react/roving-focus/src

import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

import type { RovingFocusElement } from './RovingFocusRoot';
import { useRovingFocus } from './useRovingFocus';

type RovingFocusItemProps = {
  /** The value of the `RovingFocusItem` used to determine which item should have focus. */
  value?: string;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLElement>;

/** Get the next focusable RovingFocusItem */
export function getNextFocusableValue(
  items: RovingFocusElement[],
  value: string,
): RovingFocusElement | undefined {
  const currIndex = items.findIndex((item) => item.value === value);
  return items.at(currIndex === items.length - 1 ? 0 : currIndex + 1);
}

/** Get the previous focusable RovingFocusItem */
export function getPrevFocusableValue(
  items: RovingFocusElement[],
  value: string,
): RovingFocusElement | undefined {
  const currIndex = items.findIndex((item) => item.value === value);
  return items.at(currIndex === 0 ? -1 : currIndex - 1);
}

export const RovingFocusItem = forwardRef<HTMLElement, RovingFocusItemProps>(
  ({ value, asChild, ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';

    const focusValue =
      value ?? (typeof rest.children == 'string' ? rest.children : '');

    const {
      getOrderedItems,
      getRovingProps,
      horizontalArrows,
      verticalArrows,
    } = useRovingFocus(focusValue);

    const rovingProps = getRovingProps<HTMLElement>({
      onKeyDown: (e) => {
        rest?.onKeyDown?.(e);
        const items = getOrderedItems();
        let nextItem: RovingFocusElement | undefined;

        if (horizontalArrows && e.key === 'ArrowRight') {
          nextItem = getNextFocusableValue(items, focusValue);
        }
        if (verticalArrows && e.key === 'ArrowDown') {
          nextItem = getNextFocusableValue(items, focusValue);
        }

        if (horizontalArrows && e.key === 'ArrowLeft') {
          nextItem = getPrevFocusableValue(items, focusValue);
        }
        if (verticalArrows && e.key === 'ArrowUp') {
          nextItem = getPrevFocusableValue(items, focusValue);
        }

        if (e.key === 'Home') {
          nextItem = items[0];
        }

        if (e.key === 'End') {
          nextItem = items[items.length - 1];
        }

        if (nextItem) {
          e.preventDefault();
          nextItem.element.focus();
        }
      },
    });

    const mergedRefs = useMergeRefs([ref, rovingProps.ref]);

    return (
      <Component {...rest} {...rovingProps} ref={mergedRefs}>
        {rest.children}
      </Component>
    );
  },
);
