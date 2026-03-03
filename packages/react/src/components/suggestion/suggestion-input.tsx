import { forwardRef, useContext, useEffect } from 'react';
import { Input, type InputProps } from '../input/input';
import { SuggestionContext } from './suggestion';

export type SuggestionInputProps = InputProps;

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
>(function SuggestionList({ value, onInput, onChange, ...rest }, ref) {
  const { handleFilter } = useContext(SuggestionContext);

  useEffect(handleFilter, [value]); // Filter if controlled value
  if (onChange)
    console.warn(
      'SuggestionInput: Avoid using onChange, as Suggestion controls the Input. Use onSelectedChange on Suggestion instead, or onInput if fetching API results',
    );
  if (value)
    console.warn(
      'SuggestionInput: Avoid using value, as Suggestion controls the Input. Use selected on Suggestion instead.',
    );

  return (
    <Input
      placeholder='' // We need an empty placeholder for the clear button to be able to show/hide
      ref={ref}
      onInput={(event) => {
        onInput?.(event); // Should run first
        handleFilter?.(); // Filter if uncontrolled value
      }}
      suppressHydrationWarning // Since <ds-suggestion> adds attributes
      {...rest}
    />
  );
});
