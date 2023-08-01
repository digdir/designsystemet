import type { InputHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';

import type { CheckboxProps } from './Checkbox';
import { CheckboxGroupContext } from './Group';

type UseCheckbox = (props: CheckboxProps) => FormField & {
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
/** Handles props for `Checkbox` in context with `Radio.Group` (and `Fieldset`) */
export const useCheckbox: UseCheckbox = (props) => {
  const radioGroup = useContext(CheckboxGroupContext);
  const { inputProps, readOnly, ...rest } = useFormField(props, 'radio');

  return {
    ...rest,
    readOnly,
    inputProps: {
      ...inputProps,
      readOnly,
      type: 'radio',
      required: radioGroup?.required,
      defaultChecked:
        radioGroup?.defaultValue === undefined
          ? undefined
          : radioGroup?.defaultValue === props.value,
      checked:
        radioGroup?.value === undefined
          ? undefined
          : radioGroup?.value === props.value,
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
        radioGroup?.onChange?.(e);
      },
    },
  };
};
