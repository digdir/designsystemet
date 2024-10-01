import type { InputHTMLAttributes } from 'react';
import { useContext } from 'react';

import { FieldsetContext } from '../Fieldset/FieldsetContext';
import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';

import type { InputProps } from './Input';

type UseInput = (props: InputProps) => FormField & {
  inputProps?: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    'readOnly' | 'type' | 'name' | 'required' | 'onClick' | 'onChange'
  >;
};
/** Handles props for `Input` in context with `Fieldset` */
export const useInput: UseInput = (props) => {
  const fieldset = useContext(FieldsetContext);
  const {
    inputProps,
    readOnly,
    size = fieldset?.size ?? 'md',
    ...rest
  } = useFormField(props, 'Input');

  return {
    ...rest,
    readOnly,
    size,
    inputProps: {
      ...inputProps,
      readOnly,
      onClick: (e) => {
        if (readOnly) {
          e.preventDefault();
          return;
        }
        props?.onClick?.(e);
      },
      onChange: (e) => {
        if (readOnly) {
          e.preventDefault();
          return;
        }
        props?.onChange?.(e);
      },
    },
  };
};
