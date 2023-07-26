import { useFormField } from '../useFormField';

import type { FieldsetProps } from './Fieldset';

/** Handles fieldset props and state */
export const useFieldset = (props: FieldsetProps) => {
  const formField = useFormField(props, 'fieldset');
  const { inputProps } = formField;

  return {
    ...formField,
    fieldsetProps: {
      'aria-invalid': inputProps['aria-invalid'],
      'aria-describedby': inputProps['aria-describedby'],
    },
  };
};
