import type { TextareaHTMLAttributes } from 'react';
import { useContext } from 'react';

import { FieldsetContext } from '../Fieldset/FieldsetContext';
import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';

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
  const {
    inputProps,
    readOnly,
    size = fieldset?.size ?? 'md',
    ...rest
  } = useFormField(props, 'textarea');

  return {
    ...rest,
    readOnly,
    size,
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
