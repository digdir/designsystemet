import type { FormField } from '../useFormField';
import { useFormField } from '../useFormField';

import type { RadioProps } from './Radio';

type UseRadio = RadioProps & FormField;

export const useRadio = (props: RadioProps): UseRadio => {
  const { inputProps, readOnly, ...rest } = useFormField(props, 'radio');
  return {
    ...rest,
    inputProps: {
      readOnly,
      ...inputProps,
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
