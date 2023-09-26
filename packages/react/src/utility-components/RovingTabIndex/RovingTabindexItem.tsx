import React, { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { useMergeRefs } from '@floating-ui/react';

import type { OverridableComponent } from '../../types/OverridableComponent';

import type { RovingTabindexElement } from './RovingTabindexRoot';

import { useRovingTabindex } from '.';

type RovingTabindexItemProps = {
  value?: string;
} & HTMLAttributes<HTMLElement>;

export function getNextFocusableValue(
  items: RovingTabindexElement[],
  value: string,
): RovingTabindexElement | undefined {
  const currIndex = items.findIndex((item) => item.value === value);
  return items.at(currIndex === items.length - 1 ? 0 : currIndex + 1);
}

export function getPrevFocusableValue(
  items: RovingTabindexElement[],
  value: string,
): RovingTabindexElement | undefined {
  const currIndex = items.findIndex((item) => item.value === value);
  return items.at(currIndex === 0 ? -1 : currIndex - 1);
}

export const RovingTabindexItem: OverridableComponent<
  RovingTabindexItemProps,
  HTMLElement
> = forwardRef(({ value, as: Component = 'div', ...rest }, ref) => {
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
