import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps, LabelRequired } from '../../types';
import type { MergeRight } from '../../utilities';
import { Field } from '../Field';
import { Input, type InputProps } from '../Input';
import { Label } from '../Label';
import { ValidationMessage } from '../ValidationMessage';

export type CheckboxProps = MergeRight<
  DefaultProps & Omit<InputProps, 'type' | 'role' | 'size'>,
  {
    /**
     * Optional aria-label
     */
    'aria-label'?: string;
    /**
     * Checkbox label
     */
    label?: ReactNode;
    /**
     * Description for field
     */
    description?: ReactNode;
    /**
     * Value of the `input` element
     */
    value?: InputProps['value'];
    /**
     * Error message for field
     */
    error?: ReactNode;
  } & LabelRequired
>;

/**
 * Checkbox used to select multiple options.
 *
 * @example
 * <Checkbox label="I agree" value="agree" />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      'data-size': size,
      className,
      style,
      children,
      label,
      description,
      error,
      ...rest
    },
    ref,
  ) {
    return (
      <Field data-size={size} className={className} style={style}>
        <Input type='checkbox' ref={ref} {...rest} />
        {!!label && <Label weight='regular'>{label}</Label>}
        {!!description && <div data-field='description'>{description}</div>}
        {!!error && <ValidationMessage>{error}</ValidationMessage>}
      </Field>
    );
  },
);
