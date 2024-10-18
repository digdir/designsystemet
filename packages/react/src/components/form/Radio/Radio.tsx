import cl from 'clsx/lite';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { Label } from '../../Label';
import { Input } from '../Input';
import type { FormFieldProps } from '../useFormField';

export type RadioProps = {
  /** Radio label */
  label?: ReactNode;
  /** Value of the `input` element */
  value: string;
} & Omit<FormFieldProps, 'error' | 'errorId'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { children, label, description, className, ...rest },
  ref,
) {
  return (
    <div className={cl('ds-radio', className)}>
      <Input type='radio' ref={ref} {...rest} />
      {label && <Label weight='regular'>{label}</Label>}
      {description && <div data-field='description'>{description}</div>}
    </div>
  );
});
