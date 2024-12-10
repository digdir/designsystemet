import cl from 'clsx/lite';
import type { FieldsetHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import type { DefaultProps } from '../../types';

export type FieldsetProps = DefaultProps &
  FieldsetHTMLAttributes<HTMLFieldSetElement>;

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  function Fieldset({ className, ...rest }, ref) {
    return (
      <fieldset className={cl('ds-fieldset', className)} ref={ref} {...rest} />
    );
  },
);
