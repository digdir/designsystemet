import { isDatalistClick } from '@u-elements/u-datalist';
import { forwardRef, useContext, useEffect } from 'react';
import { useMergeRefs } from '../../utilities/hooks';
import { Input, type InputProps } from '../Input';
import { MultiSuggestionContext } from './MultiSuggestion';

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
  const { listId, inputRef, handleFilter } = useContext(MultiSuggestionContext);
  const mergedRefs = useMergeRefs([inputRef, ref]);

  // Update also if controlled value
  useEffect(() => {
    handleFilter?.(inputRef?.current);
  }, [value]);

  return (
    <Input
      ref={mergedRefs}
      list={listId}
      value={value}
      onInput={(event) => {
        onInput?.(event); // Should run first

        if (!isDatalistClick(event.nativeEvent as InputEvent))
          handleFilter?.(inputRef?.current);
      }}
      placeholder='' // We need an empty placeholder for the clear button to be able to show/hide
      {...rest}
    />
  );
});
