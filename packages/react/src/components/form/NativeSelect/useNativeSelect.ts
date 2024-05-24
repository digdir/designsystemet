import type { SelectHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';
import { FieldsetContext } from '../Fieldset/FieldsetContext';
import { getSize } from '../../../utilities/getSize';

import type { NativeSelectProps } from './NativeSelect';

type UseNativeSelect = (props: NativeSelectProps) => Omit<
  FormField,
  'inputProps'
> & {
  selectProps: Pick<
    SelectHTMLAttributes<HTMLSelectElement>,
    'name' | 'required' | 'onClick' | 'onChange' | 'id'
  >;
};

/** Handles props for `NativeSelect` in context with `Fieldset` */
export const useNativeSelect: UseNativeSelect = (props) => {
  const fieldset = useContext(FieldsetContext);
  const {
    inputProps: selectProps,
    readOnly,
    ...rest
  } = useFormField(props, 'select');

  const size = getSize(fieldset?.size ?? props.size ?? 'md') as NonNullable<
    NativeSelectProps['size']
  >;

  return {
    ...rest,
    readOnly,
    size,
    selectProps: {
      ...selectProps,
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
