import type { OptionHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type MultiSuggestionEmptyProps = DefaultProps &
  OptionHTMLAttributes<HTMLOptionElement>;

/**
 * Component that provides an empty MultiSuggestion list.
 *
 * Place as a descendant of `MultiSuggestion.List`
 *
 * @example
 * <MultiSuggestion.List>
 *   <MultiSuggestion.Empty>Tomt</MultiSuggestion.Empty>
 * </MultiSuggestion.List>
 */
export const MultiSuggestionEmpty = forwardRef<
  HTMLOptionElement,
  MultiSuggestionEmptyProps
>(function MultiSuggestionEmpty(rest, ref) {
  return (
    // biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: Empty option shoult not be interactive
    <u-option data-empty role='none' ref={ref} {...rest} />
  );
});
