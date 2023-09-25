import type { InputHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';
import { FieldsetContext } from '../Fieldset';

import type { SearchProps } from './Search';

type UseSearch = (props: SearchProps) => Omit<FormField, 'inputProps'> & {
  inputProps: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    'readOnly' | 'name' | 'required' | 'onClick' | 'onChange'
  > &
    FormField['inputProps'];
};

/** Handles props for `Search` in context with `Fieldset` */
export const useSearch: UseSearch = (props) => {
  const fieldset = useContext(FieldsetContext);
  const { inputProps, readOnly, ...rest } = useFormField(props, 'search');

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
