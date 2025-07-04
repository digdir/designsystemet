import type { OptionHTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import type { DefaultProps } from '../../types';
import { SuggestionContext } from './suggestion';

export type SuggestionEmptyProps = DefaultProps &
  OptionHTMLAttributes<HTMLOptionElement>;

/**
 * Component that provides an empty Suggestion list.
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
  const { isEmpty } = useContext(SuggestionContext);
  return isEmpty ? <u-option data-empty value='' ref={ref} {...rest} /> : null;
});
