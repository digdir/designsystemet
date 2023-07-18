import type { InputHTMLAttributes } from 'react';

import type { RadioProps } from './Radio';

type UseRadio = RadioProps & {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
};

export const useRadio = ({
  readOnly,
  size,
  ...props
}: RadioProps): UseRadio => {
  return {
    size,
    inputProps: {
      ...props,
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
