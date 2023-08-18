import type { InputHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';
import { CheckboxGroupContext } from '../Checkbox/Group';

import type { SwitchProps } from './Switch';

type UseCheckbox = (props: SwitchProps) => FormField & {
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
export const useSwitch: UseCheckbox = (props) => {
  const checkboxGroup = useContext(CheckboxGroupContext);
  const { inputProps, readOnly, ...rest } = useFormField(props, 'checkbox');

  return {
    ...rest,
    readOnly,
    inputProps: {
      ...inputProps,
      readOnly,
      type: 'checkbox',
      defaultChecked:
        checkboxGroup?.defaultValue === undefined
          ? undefined
          : checkboxGroup?.defaultValue.includes(props.value),
      checked:
        checkboxGroup?.value === undefined
          ? undefined
          : checkboxGroup?.value.includes(props.value),
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
