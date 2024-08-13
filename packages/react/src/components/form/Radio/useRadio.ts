import type { InputHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';

import type { RadioProps } from './Radio';
import { RadioGroupContext } from './RadioGroup';

type UseRadio = (props: RadioProps) => FormField & {
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
/** Handles props for `Radio` in context with `Radio.Group` (and `Fieldset`) */
export const useRadio: UseRadio = (props) => {
  const radioGroup = useContext(RadioGroupContext);
  const { inputProps, readOnly, ...rest } = useFormField(props, 'radio');

  return {
    ...rest,
    readOnly,
    inputProps: {
      ...inputProps,
      readOnly,
      type: 'radio',
      name: radioGroup?.name ?? props.name,
      required: radioGroup?.required,
      defaultChecked: radioGroup?.defaultValue
        ? radioGroup?.defaultValue === props.value
        : props.defaultChecked,
      checked: radioGroup?.value
        ? radioGroup?.value === props.value
        : props.checked,
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
        radioGroup?.onChange?.(props.value);
      },
    },
  };
};
