import { getDatalistValue, isDatalistClick } from '@u-elements/u-datalist';
import { forwardRef, useCallback, useContext, useEffect } from 'react';
import { useMergeRefs } from '../../utilities/hooks';
import { Input, type InputProps } from '../Input';
import { SuggestionContext } from './Suggestion';

export type SuggestionInputProps = InputProps;

/**
 * Component that provides an input field for the suggestion list.
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
>(function SuggestionList({ value, onInput, ...rest }, ref) {
  const { listId, inputRef, handleFilter } = useContext(SuggestionContext);
  const mergedRefs = useMergeRefs([inputRef, ref]);
  const updateSelected = useCallback(() => {
    const { list, value } = inputRef?.current || {};
    for (const option of list?.options || []) {
      option.selected = getDatalistValue(option) === value;
    }
  }, []);

  // Update also if controlled value
  useEffect(() => {
    updateSelected();
    handleFilter?.(inputRef?.current);
  }, [value]);

  return (
    <Input
      ref={mergedRefs}
      list={listId}
      value={value}
      onInput={(event) => {
        onInput?.(event); // Should run first
        updateSelected();

        if (!isDatalistClick(event.nativeEvent as InputEvent))
          handleFilter?.(inputRef?.current);
      }}
      placeholder='' // We need an empty placeholder for the clear button to be able to show/hide
      {...rest}
    />
  );
});
