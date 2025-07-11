import { forwardRef, useContext, useEffect, version } from 'react';
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
    // biome-ignore lint/correctness/noUnusedVariables: we overwrite React's HTMLAttributes to add custom attributes
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
  const { listId, handleFilter } = useContext(SuggestionContext);

  useEffect(handleFilter, [value]); // Filter if controlled value
  if (onChange)
    console.warn(
      'SuggestionInput: Avoid using onChange, as Suggestion controls the Input. Use onValueChange on Suggest instead, or onInput if fetching API results',
    );
  if (value)
    console.warn(
      'SuggestionInput: Avoid using value, as Suggestion controls the Input. Use value on Suggest instead.',
    );

  const popoverProps = Object.assign(
    {
      [version.startsWith('19') ? 'popoverTarget' : 'popovertarget']: listId,
    },
    rest,
  );

  return (
    <Input
      placeholder='' // We need an empty placeholder for the clear button to be able to show/hide
      ref={ref}
      onInput={(event) => {
        onInput?.(event); // Should run first
        handleFilter?.(); // Filter if uncontrolled value
      }}
      {...popoverProps}
    />
  );
});
