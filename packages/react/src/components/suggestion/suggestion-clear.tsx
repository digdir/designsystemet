import { type ButtonHTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type SuggestionClearProps = MergeRight<
  DefaultProps & ButtonHTMLAttributes<HTMLButtonElement>,
  {
    /**
     * Aria label for the clear button
     * @deprecated Please use `--dsc-suggestion-sr-clear` or `data-sr-clear` on Suggestion to set label.
     */
    'aria-label'?: string;
  }
>;

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
