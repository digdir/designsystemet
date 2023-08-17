import type { InputHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';
import { FieldsetContext } from '../Fieldset';

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
/** Handles props for `Checkbox` in context with `Checkbox.Group` (and `Fieldset`) */
export const useSwitch: UseCheckbox = (props) => {
  const fieldset = useContext(FieldsetContext);

  const { inputProps, readOnly, ...rest } = useFormField(props, 'checkbox');

  return {
    ...rest,
    readOnly,
    inputProps: {
      ...inputProps,
      readOnly,
      type: 'checkbox',
      // defaultChecked:
      //   fieldset?.defaultValue === undefined
      //     ? undefined
      //     : fieldset?.defaultValue.includes(props.value),
      // checked:
      //   fieldset?.value === undefined
      //     ? undefined
      //     : fieldset?.value.includes(props.value),
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
