import { forwardRef } from 'react';
import '@digdir/designsystemet-web'; // Load u-option polyfill
import type { SuggestionOptionProps } from './suggestion-option';
import { SuggestionOption } from './suggestion-option';

export type SuggestionEmptyProps = SuggestionOptionProps;

/**
 * Component that provides an empty Suggestion list.
 *
 * Place as a descendant of `Suggestion.List`
 * @deprecated Use `Suggestion.Option` with data-empty instead
 * @example
 * <Suggestion.List>
 *   <Suggestion.Option data-empty>Tomt</Suggestion.Option>
 * </Suggestion.List>
 */
export const SuggestionEmpty = forwardRef<
  HTMLOptionElement,
  SuggestionEmptyProps
>(function SuggestionEmpty(rest, ref) {
  return <SuggestionOption data-empty {...rest} ref={ref} />;
});
