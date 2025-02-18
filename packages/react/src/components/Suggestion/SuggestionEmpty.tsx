import type { OptionHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type SuggestionEmptyProps = DefaultProps &
  OptionHTMLAttributes<HTMLOptionElement>;

/**
 * Component that provides an empty suggestion list.
 *
 * Place as a descendant of `Suggestion.List`
 *
 * @example
 * <Suggestion.List>
 *   <Suggestion.Empty>Tomt</Suggestion.Empty>
 * </Suggestion.List>
 */
export const SuggestionEmpty = forwardRef<
  HTMLOptionElement,
  SuggestionEmptyProps
>(function SuggestionEmpty(rest, ref) {
  return (
    // biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: Empty option shoult not be interactive
    <u-option data-empty role='none' ref={ref} {...rest} />
  );
});
