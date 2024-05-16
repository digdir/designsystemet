import type { InputHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';
import { FieldsetContext } from '../Fieldset/FieldsetContext';

import type { SearchProps } from './Search';

type UseSearch = (props: SearchProps) => {
  size?: 'small' | 'medium' | 'large';
} & Omit<FormField, 'inputProps' | 'size'> & {
    inputProps: Pick<
      InputHTMLAttributes<HTMLInputElement>,
      'readOnly' | 'name' | 'required' | 'onClick' | 'onChange'
    > &
      FormField['inputProps'];
  };

const sizeMap: Record<
  NonNullable<FormField['size']>,
  'small' | 'medium' | 'large'
> = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

/** Handles props for `Search` in context with `Fieldset` */
export const useSearch: UseSearch = (props) => {
  const fieldset = useContext(FieldsetContext);
  const { inputProps, readOnly, ...rest } = useFormField(props, 'search');

  const fieldSetSize = fieldset?.size ? sizeMap[fieldset?.size] : null;

  return {
    ...rest,
    readOnly,
    size: fieldSetSize ?? props.size,
    inputProps: {
      ...inputProps,
      type: 'search',
      name: props.name ?? 'q',
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
