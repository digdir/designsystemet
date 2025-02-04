import { Slot } from '@radix-ui/react-slot';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type MultiSelectEmptyProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
  }
>;

/**
 * Component that provides an empty MultiSelect list.
 *
 * Place as a descendant of `MultiSelect.List`
 *
 * @example
 * <MultiSelect.List>
 *   <MultiSelect.Empty>Tomt</MultiSelect.Empty>
 * </MultiSelect.List>
 */
export const MultiSelectEmpty = forwardRef<
  HTMLDivElement,
  MultiSelectEmptyProps
>(function MultiSelectEmpty({ asChild, ...rest }, ref) {
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      aria-disabled='true'
      ref={ref}
      role='option'
      tabIndex={0}
      {...rest}
    />
  );
});
