import { useMergeRefs } from '@floating-ui/react';
import { type ChangeEvent, forwardRef, useRef, useState } from 'react';
import { omit } from '../../../utilities';
import { Input } from '../Input';

type SearchInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'readOnly' | 'type'
> &
  (
    | { 'aria-label': string; 'aria-labelledby'?: never }
    | { 'aria-label'?: never; 'aria-labelledby': string }
  );

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref) => {
    const {
      style,
      defaultValue,
      value,
      onChange,
      disabled,
      className,
      ...rest
    } = props;
    const inputRef = useRef<HTMLInputElement>();
    const mergedRef = useMergeRefs([ref, inputRef]);

    const [internalValue, setInternalValue] = useState(defaultValue ?? '');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      value === undefined && setInternalValue(e.target.value);
    };

    return (
      <Input
        ref={mergedRef}
        value={value ?? internalValue}
        disabled={disabled}
        {...omit(['error', 'errorId', 'readOnly'], rest)}
        type='search'
        onChange={handleChange}
        /* We need an empty placeholder for the clear button to be able to show/hide */
        placeholder=''
        {...rest}
      />
    );
  },
);
