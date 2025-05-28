import { forwardRef, useContext, useEffect } from 'react';
import { Input, type InputProps } from '../Input';
import { MultiSuggestionContext } from './MultiSuggestion';
// import { useMergeRefs } from '../../utilities/hooks';
// import { MultiSuggestionContext } from './MultiSuggestion';

export type MultiSuggestionInputProps = InputProps;

/**
 * Component that provides an input field for the MultiSuggestion list.
 *
 * Place as a descendant of `MultiSuggestion`
 *
 * @example
 * <MultiSuggestion>
 *   <MultiSuggestion.Input />
 *   <MultiSuggestion.List />
 * </MultiSuggestion>
 */
export const MultiSuggestionInput = forwardRef<
  HTMLInputElement,
  MultiSuggestionInputProps
>(function MultiSuggestionList({ value, onInput, ...rest }, ref) {
  const { handleFilter } = useContext(MultiSuggestionContext);

  // Update also if controlled value
  useEffect(handleFilter, [value]);

  return (
    <Input
      placeholder='' // We need an empty placeholder for the clear button to be able to show/hide
      ref={ref}
      onInput={(event) => {
        onInput?.(event); // Should run first
        handleFilter?.();
      }}
      value={value}
      {...rest}
    />
  );
});
