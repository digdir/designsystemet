import { type ButtonHTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type SuggestionClearProps = DefaultProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Component that provides a clear button for the Suggestion input.
 *
 * Place as a descendant of `Suggestion`
 *
 * @example
 * <Suggestion>
 *   <Suggestion.Input />
 *   <Suggestion.Toggle />
 *   <Suggestion.Clear />
 *   <Suggestion.List />
 * </Suggestion>
 */
export const SuggestionClear = forwardRef<
  HTMLButtonElement,
  SuggestionClearProps
>(function SuggestionClear(rest, ref) {
  return (
    <button
      hidden
      ref={ref}
      suppressHydrationWarning // Since <ds-suggestion> adds attributes
      type='reset'
      {...rest}
    />
  );
});
