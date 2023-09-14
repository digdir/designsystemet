import type { InputHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';
import { FieldsetContext } from '../Fieldset';

import type { TextfieldProps } from './Textfield';

type UseCheckbox = (props: TextfieldProps) => FormField & {
  inputProps?: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    | 'readOnly'
    | 'type'
    | 'name'
    | 'required'
    | 'defaultChecked'
    | 'checked'
    | 'onClick'
    | 'onChange'
  >;
};
/** Handles props for `Switch` in context with `Checkbox.Group` (and `Fieldset`) */
export const useTextfield: UseCheckbox = (props) => {
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
