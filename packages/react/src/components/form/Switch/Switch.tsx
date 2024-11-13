import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { Label } from '../../Label';
import { Field, type FieldProps } from '../Field';
import { Input, type InputProps } from '../Input';

export type SwitchProps = {
  /** Optional aria-label */
  'aria-label'?: string;
  /** Radio label */
  label?: ReactNode;
  /** Description for field */
  description?: ReactNode;
  /** Value of the `input` element */
  value?: InputProps['value'];
  /** Position of switch
   * @default start
   */
  position?: FieldProps['position'];
  /**
   * Changes field size and paddings
   */
  'data-size'?: 'sm' | 'md' | 'lg';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  (
    | { 'aria-label': string; 'aria-labelledby'?: never; label?: never }
    | { 'aria-label'?: never; 'aria-labelledby'?: never; label: ReactNode }
    | { 'aria-label'?: never; 'aria-labelledby': string; label?: never }
  );

/**
 * Switch used to toggle options.
 * @example
 * <Switch label="I agree" value="agree" />
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    'data-size': size,
    children,
    className,
    description,
    label,
    position,
    style,
    ...rest
  },
  ref,
) {
  console.log(position);
  return (
    <Field
      {...{ className, style, 'data-size': size, 'data-position': position }}
    >
      <Input type='checkbox' role='switch' ref={ref} {...rest} />
      {!!label && <Label weight='regular'>{label}</Label>}
      {!!description && <div data-field='description'>{description}</div>}
    </Field>
  );
});
