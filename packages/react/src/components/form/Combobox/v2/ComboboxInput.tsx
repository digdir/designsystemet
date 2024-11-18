import { useMergeRefs } from '@floating-ui/react';
import { forwardRef, useContext } from 'react';
import { Popover } from '../../../Popover';
import { Input, type InputProps } from '../../Input';
import { ComboboxContext } from './Combobox';

export type ComboboxInputProps = InputProps;

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxList(rest, ref) {
    const { listId, inputRef } = useContext(ComboboxContext);
    const mergedRefs = useMergeRefs([inputRef, ref]);

    /* We need an empty placeholder for the clear button to be able to show/hide */
    return (
      <Popover.Trigger asChild>
        <Input ref={mergedRefs} list={listId} placeholder='' {...rest} />
      </Popover.Trigger>
    );
  },
);
