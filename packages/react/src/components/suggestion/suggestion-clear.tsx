import { type ButtonHTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';

/* The accessible name is set with `--dsc-suggestion-sr-clear` or `data-sr-clear` on the parent */
export type SuggestionClearProps = DefaultProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>;

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
