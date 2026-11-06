import { type ButtonHTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type SuggestionToggleProps = DefaultProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

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
>(function SuggestionToggle(rest, ref) {
  return (
    <button
      aria-expanded='false'
      ref={ref}
      suppressHydrationWarning // Since <ds-suggestion> adds attributes
      type='button'
      {...rest}
    />
  );
});
