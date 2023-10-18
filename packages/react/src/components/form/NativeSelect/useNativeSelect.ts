import type { InputHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';
import { FieldsetContext } from '../Fieldset';

import type { NativeSelectProps } from './NativeSelect';

type UseNativeSelect = (props: NativeSelectProps) => FormField & {
  inputProps?: Pick<
    InputHTMLAttributes<HTMLSelectElement>,
    'readOnly' | 'type' | 'name' | 'required' | 'onClick' | 'onChange'
  >;
};
/** Handles props for `Textfield` in context with `Fieldset` */
export const useNativeSelect: UseNativeSelect = (props) => {
  const fieldset = useContext(FieldsetContext);
  const { inputProps, readOnly, ...rest } = useFormField(props, 'select');

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
