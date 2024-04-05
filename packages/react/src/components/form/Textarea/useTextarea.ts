import type { TextareaHTMLAttributes } from 'react';
import { useContext } from 'react';

import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';
import { FieldsetContext } from '../Fieldset/FieldsetContext';

import type { TextareaProps } from './Textarea';

type UseTextarea = (props: TextareaProps) => Omit<FormField, 'inputProps'> & {
  textareaProps: Pick<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'readOnly' | 'name' | 'required' | 'onClick' | 'onChange'
  > &
    FormField['inputProps'];
};

/** Handles props for `Textarea` in context with `Fieldset` */
export const useTextarea: UseTextarea = (props) => {
  const fieldset = useContext(FieldsetContext);
  const { inputProps, readOnly, ...rest } = useFormField(props, 'textarea');

  return {
    ...rest,
    readOnly,
    size: fieldset?.size ?? props.size,
    textareaProps: {
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
