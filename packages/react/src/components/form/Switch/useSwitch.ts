import type { InputHTMLAttributes } from 'react';

// import { CheckboxGroupContext } from '../Checkbox/CheckboxGroup';
import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';

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
  // const checkboxGroup = useContext(CheckboxGroupContext);
  const { inputProps, readOnly, ...rest } = useFormField(props, 'switch');

  const propsValue = props.value || '';
  return {
    ...rest,
    readOnly,
    inputProps: {
      ...inputProps,
      readOnly,
      type: 'checkbox',
      role: 'switch',
      // defaultChecked: checkboxGroup?.defaultValue
      //   ? checkboxGroup?.defaultValue.includes(propsValue)
      //   : props.defaultChecked,
      // checked: checkboxGroup?.value
      //   ? checkboxGroup?.value.includes(propsValue)
      //   : props.checked,
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
        // checkboxGroup?.toggleValue(propsValue);
      },
    },
  };
};
