import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';

import type { RadioProps } from './Radio';
import { RadioGroupContext } from './Group';

type UseRadio = (props: RadioProps) => FormField;

export const useRadio: UseRadio = (props) => {
  const radioGroup = useContext(RadioGroupContext);
  const { inputProps, readOnly, ...rest } = useFormField(props, 'radio');

  return {
    ...rest,
    size: radioGroup?.size || rest.size,
    inputProps: {
      readOnly,
      ...inputProps,
      name: radioGroup?.name,
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
        console.log('onClick');
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
