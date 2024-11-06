import cl from 'clsx/lite';
import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import type { DefaultProps } from '../../../types';

export type FieldsetProps = {
  /** Toggle `disabled` all input fields within the fieldset. */
  disabled?: boolean;
  /** If set, this will diplay an error message at the bottom of the fieldset. */
  error?: ReactNode;
} & FieldsetHTMLAttributes<HTMLFieldSetElement> &
  DefaultProps;

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  function Fieldset({ className, ...rest }, ref) {
    return (
      <fieldset className={cl('ds-fieldset', className)} ref={ref} {...rest} />
    );
  },
);
