import type { OptionHTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import type { DefaultProps } from '../../types';
import { MultiSuggestionContext } from './MultiSuggestion';

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
  const { isEmpty } = useContext(MultiSuggestionContext);
  return isEmpty ? <u-option data-empty value='' ref={ref} {...rest} /> : null;
});
