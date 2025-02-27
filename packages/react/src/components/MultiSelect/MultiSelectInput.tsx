import { useMergeRefs } from '@floating-ui/react';
import { isDatalistClick } from '@u-elements/u-datalist';
import { forwardRef, useContext, useEffect } from 'react';
import { Input, type InputProps } from '../Input';
import { MultiSelectContext } from './MultiSelect';

export type MultiSelectInputProps = InputProps;

/**
 * Component that provides an input field for the MultiSelect list.
 *
 * Place as a descendant of `MultiSelect`
 *
 * @example
 * <MultiSelect>
 *   <MultiSelect.Input />
 *   <MultiSelect.List />
 * </MultiSelect>
 */
export const MultiSelectInput = forwardRef<
  HTMLInputElement,
  MultiSelectInputProps
>(function MultiSelectList({ value, onInput, ...rest }, ref) {
  const { listId, inputRef, handleFilter } = useContext(MultiSelectContext);
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
