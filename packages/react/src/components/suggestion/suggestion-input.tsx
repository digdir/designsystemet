import { forwardRef } from 'react';
import { Input, type InputProps } from '../input/input';

export type SuggestionInputProps = Omit<
  InputProps,
  'role' | 'data-indeterminate'
>;

// Make React support popovertarget attribute
// https://github.com/facebook/react/issues/27479
declare global {
  namespace React.JSX {
    interface IntrinsicAttributes {
      popovertarget?: string;
    }
  }
  namespace React {
    interface HTMLAttributes<T> {
      popovertarget?: string;
    }
  }
}

/**
 * Component that provides an input field for the Suggestion list.
 *
 * Place as a descendant of `Suggestion`
 *
 * @example
 * <Suggestion>
 *   <Suggestion.Input />
 *   <Suggestion.List />
 * </Suggestion>
 */
export const SuggestionInput = forwardRef<
  HTMLInputElement,
  SuggestionInputProps
>(function SuggestionInput(rest, ref) {
  if (rest.onChange)
    console.warn(
      'SuggestionInput: Avoid using onChange, as Suggestion controls the Input. Use oncomboboxbeforeselect on Suggestion instead, or onInput if fetching API results',
    );
  if (rest.value)
    console.warn(
      'SuggestionInput: Avoid using value, as the Input is controlled by the <data> elements in Suggestion. Use oncomboboxbeforeselect on Suggestion with the suggestion() helper instead.',
    );

  return (
    <Input
      suppressHydrationWarning // Since <ds-suggestion> adds attributes
      ref={ref}
      {...rest}
    />
  );
});
