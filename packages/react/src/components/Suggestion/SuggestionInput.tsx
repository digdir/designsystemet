import { useMergeRefs } from '@floating-ui/react';
import { forwardRef, useCallback, useContext, useEffect } from 'react';
import { Input, type InputProps } from '../Input';
import { SuggestionContext } from './Suggestion';

export type SuggestionInputProps = InputProps;

export const SuggestionInput = forwardRef<
  HTMLInputElement,
  SuggestionInputProps
>(function SuggestionList({ value, onChange, ...rest }, ref) {
  const { listId, inputRef } = useContext(SuggestionContext);
  const mergedRefs = useMergeRefs([inputRef, ref]);
  const updateSelected = useCallback(() => {
    const { list, value } = inputRef?.current || {};
    for (const option of list?.options || []) {
      option.selected = option.value === value;
    }
  }, []);

  useEffect(updateSelected, [value]);

  return (
    <Input
      ref={mergedRefs}
      list={listId}
      value={value}
      onChange={(event) => {
        updateSelected();
        onChange?.(event);
      }}
      placeholder='' // We need an empty placeholder for the clear button to be able to show/hide
      {...rest}
    />
  );
});
