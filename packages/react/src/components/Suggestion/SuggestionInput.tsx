import { forwardRef, useContext, useEffect } from 'react';
import { Input, type InputProps } from '../Input';
import { SuggestionContext } from './Suggestion';

export type SuggestionInputProps = InputProps;

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
      'SuggestionInput: Avoid using onChange, as Suggestion controls the Input. Use onValueChange on Suggest instead, or onInput if fetching API results',
    );
  if (value)
    console.warn(
      'SuggestionInput: Avoid using value, as Suggestion controls the Input. Use value on Suggest instead.',
    );

  return (
    <Input
      placeholder='' // We need an empty placeholder for the clear button to be able to show/hide
      ref={ref}
      onInput={(event) => {
        onInput?.(event); // Should run first
        // handleFilter?.(); // Filter if uncontrolled value
      }}
      {...rest}
    />
  );
});
