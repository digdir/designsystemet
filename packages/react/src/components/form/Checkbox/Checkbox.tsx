import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { Label } from '../../Label';
import { ValidationMessage } from '../../ValidationMessage';
import { Field } from '../Field';
import { Input } from '../Input';

export type CheckboxProps = {
  /** Optional aria-label */
  'aria-label'?: string;
  /** Checkbox label */
  label?: ReactNode;
  /** Description for field */
  description?: ReactNode;
  /** Value of the `input` element */
  value: string;
  /** Validation message for field */
  validation?: ReactNode;
  /**
   * Changes field size and paddings
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
  /**Toggle indeterminate state for Checkbox
   * @default false
   */
  indeterminate?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  (
    | { 'aria-label': string; label?: never }
    | { 'aria-label'?: never; label: ReactNode }
  );

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { children, label, description, validation, ...rest },
    ref,
  ) {
    return (
      <Field>
        <Input type='checkbox' ref={ref} {...rest} />
        {!!label && <Label weight='regular'>{label}</Label>}
        {!!description && <div data-field='description'>{description}</div>}
        {!!validation && <ValidationMessage>{validation}</ValidationMessage>}
      </Field>
    );
  },
);
