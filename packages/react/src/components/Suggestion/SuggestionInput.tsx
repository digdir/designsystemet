import { forwardRef, useContext } from 'react';
import { Input, type InputProps } from '../Input';
import { SuggestionContext } from './Suggestion';

export type SuggestionInputProps = InputProps;

export const SuggestionInput = forwardRef<
  HTMLInputElement,
  SuggestionInputProps
>(function SuggestionList(rest, ref) {
  const { listId } = useContext(SuggestionContext);

  /* We need an empty placeholder for the clear button to be able to show/hide */
  return <Input ref={ref} list={listId} placeholder='' {...rest} />;
});
