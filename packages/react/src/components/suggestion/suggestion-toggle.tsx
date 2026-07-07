import { type ButtonHTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type SuggestionToggleProps = MergeRight<
  DefaultProps & ButtonHTMLAttributes<HTMLButtonElement>,
  {
    /**
     * Aria label for the toggle button
     * @default 'Valg'
     */
    'aria-label'?: string;
  }
>;

/**
 * Component that provides a toggle button for the Suggestion list.
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
export const SuggestionToggle = forwardRef<
  HTMLButtonElement,
  SuggestionToggleProps
>(function SuggestionToggle({ 'aria-label': label = 'Valg', ...rest }, ref) {
  return (
    <button
      aria-expanded='false'
      aria-label={label}
      ref={ref}
      suppressHydrationWarning // Since <ds-suggestion> adds attributes
      type='button'
      {...rest}
    />
  );
});
