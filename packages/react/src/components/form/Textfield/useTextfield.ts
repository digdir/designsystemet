import type { InputHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';
import { FieldsetContext } from '../Fieldset/FieldsetContext';

import type { TextfieldProps } from './Textfield';

type UseTextfield = (props: TextfieldProps) => FormField & {
  inputProps?: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    'readOnly' | 'type' | 'name' | 'required' | 'onClick' | 'onChange'
  >;
};
/** Handles props for `Textfield` in context with `Fieldset` */
export const useTextfield: UseTextfield = (props) => {
  const fieldset = useContext(FieldsetContext);
  const { inputProps, readOnly, ...rest } = useFormField(props, 'textfield');

  return {
    ...rest,
    readOnly,
    size: fieldset?.size ?? props.size,
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
