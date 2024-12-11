import { forwardRef, useContext } from 'react';
import { Input, type InputProps } from '../Input';
import { Popover } from '../Popover';
import { SuggestionContext } from './Suggestion';

export type SuggestionInputProps = InputProps;

export const SuggestionInput = forwardRef<
  HTMLInputElement,
  SuggestionInputProps
>(function SuggestionList(rest, ref) {
  const { listId } = useContext(SuggestionContext);

  /* We need an empty placeholder for the clear button to be able to show/hide */
  return (
    <Popover.Trigger asChild>
      <Input ref={ref} list={listId} placeholder='' {...rest} />
    </Popover.Trigger>
  );
});
