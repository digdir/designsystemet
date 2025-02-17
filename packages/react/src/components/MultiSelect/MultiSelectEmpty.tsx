import type { OptionHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type MultiSelectEmptyProps = DefaultProps &
  OptionHTMLAttributes<HTMLOptionElement>;

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
  HTMLOptionElement,
  MultiSelectEmptyProps
>(function MultiSelectEmpty(rest, ref) {
  return (
    // biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: Empty option shoult not be interactive
    <u-option data-empty role='none' ref={ref} {...rest} />
  );
});
