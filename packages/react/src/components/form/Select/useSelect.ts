import type { SelectHTMLAttributes } from 'react';
import { useContext } from 'react';

import { FieldsetContext } from '../Fieldset/FieldsetContext';
import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';

import type { SelectProps } from './Select';

type UseSelect = (props: SelectProps) => Omit<FormField, 'inputProps'> & {
  selectProps: Pick<
    SelectHTMLAttributes<HTMLSelectElement>,
    | 'name'
    | 'required'
    | 'onClick'
    | 'onChange'
    | 'id'
    | 'onKeyDown'
    | 'onMouseDown'
  >;
};

/** Handles props for `Select` in context with `Fieldset` */
export const useSelect: UseSelect = (props) => {
  const fieldset = useContext(FieldsetContext);
  const {
    inputProps: selectProps,
    readOnly = false,
    size = fieldset?.size ?? 'md',
    ...rest
  } = useFormField(props, 'select');

  return {
    ...rest,
    readOnly,
    size,
    selectProps: {
      ...selectProps,
      readOnly,
      onClick: (event) => {
        if (readOnly) return event.preventDefault();
        props?.onClick?.(event);
      },
      onKeyDown: (event) => {
        if (readOnly) {
          if (event.key === 'Tab') return;
          return event.preventDefault();
        }
        props?.onKeyDown?.(event);
      },
      onMouseDown: (event) => {
        if (readOnly) {
          if (event.target instanceof HTMLElement) event.target.focus();
          return event.preventDefault();
        }
        props?.onMouseDown?.(event);
      },
      onChange: (event) => {
        if (readOnly) return event.preventDefault();
        props?.onChange?.(event);
      },
    },
  };
};
