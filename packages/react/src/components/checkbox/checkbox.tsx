import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps, LabelRequired } from '../../types';
import type { MergeRight } from '../../utilities';
import { Field } from '../field';
import { Input, type InputProps } from '../input/input';
import { Label } from '../label/label';
import { ValidationMessage } from '../validation-message/validation-message';

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
    /**
     * If outline, the checkbox will have a border.
     * @default 'default'
     */
    'data-variant'?: 'default' | 'outline';
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
      'data-variant': variant,
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
      <Field
        data-size={size}
        data-variant={variant}
        className={className}
        style={style}
      >
        <Input type='checkbox' ref={ref} {...rest} />
        {!!label && <Label weight='regular'>{label}</Label>}
        {!!description && <div data-field='description'>{description}</div>}
        {!!error && <ValidationMessage>{error}</ValidationMessage>}
      </Field>
    );
  },
);
