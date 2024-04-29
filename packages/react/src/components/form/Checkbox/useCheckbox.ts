import type { InputHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';

import type { CheckboxProps } from './Checkbox';
import { CheckboxGroupContext } from './Group';

type UseCheckbox = (props: CheckboxProps) => FormField & {
  inputProps?: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    'readOnly' | 'type' | 'name' | 'required' | 'defaultChecked' | 'checked' | 'onClick' | 'onChange'
  >;
};
/** Handles props for `Checkbox` in context with `Checkbox.Group` (and `Fieldset`) */
export const useCheckbox: UseCheckbox = (props) => {
  const checkboxGroup = useContext(CheckboxGroupContext);
  const { inputProps, readOnly, ...rest } = useFormField(props, 'checkbox');

  return {
    ...rest,
    readOnly,
    inputProps: {
      ...inputProps,
      readOnly,
      type: 'checkbox',
      defaultChecked: checkboxGroup?.defaultValue
        ? checkboxGroup?.defaultValue.includes(props.value)
        : props.defaultChecked,
      checked: checkboxGroup?.value ? checkboxGroup?.value.includes(props.value) : props.checked,
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
        checkboxGroup?.toggleValue(props.value);
      },
    },
  };
};
