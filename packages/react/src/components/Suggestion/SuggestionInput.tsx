import { useMergeRefs } from '@floating-ui/react';
import { forwardRef, useContext } from 'react';
import { Input, type InputProps } from '../Input';
import { SuggestionContext } from './Suggestion';

export type SuggestionInputProps = InputProps;

export const SuggestionInput = forwardRef<
  HTMLInputElement,
  SuggestionInputProps
>(function SuggestionList(rest, ref) {
  const { listId, inputRef } = useContext(SuggestionContext);

  const mergedRefs = useMergeRefs([inputRef, ref]);

  return (
    <Input
      ref={mergedRefs}
      list={listId}
      placeholder='' // We need an empty placeholder for the clear button to be able to show/hide
      {...rest}
    />
  );
});
