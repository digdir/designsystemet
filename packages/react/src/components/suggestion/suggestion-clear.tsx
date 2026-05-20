import { type ButtonHTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

/* We omit children since we render the icon with css */
export type SuggestionClearProps = MergeRight<
  DefaultProps & ButtonHTMLAttributes<HTMLButtonElement>,
  {
    /**
     * Aria label for the clear button
     * @default 'Tøm'
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
 *   <Suggestion.Clear />
 *   <Suggestion.List />
 * </Suggestion>
 */
export const SuggestionClear = forwardRef<
  HTMLButtonElement,
  SuggestionClearProps
>(function SuggestionClear({ 'aria-label': label = 'Tøm', ...rest }, ref) {
  return (
    <button
      aria-label={label}
      hidden
      ref={ref}
      suppressHydrationWarning // Since <ds-suggestion> adds attributes
      type='reset'
      {...rest}
    />
  );
});
