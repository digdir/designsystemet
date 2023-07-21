import { useContext, useId } from 'react';
import type { HTMLAttributes, InputHTMLAttributes } from 'react';
import cl from 'classnames';

import { FieldsetContext } from './Fieldset';

export type FormFieldProps = {
  /** Error message */
  error?: React.ReactNode;
  /** Override generated errorId */
  errorId?: string;
  /**
    Disables element
   * @note Avoid using if possible for accessibility purposes
   */
  disabled?: boolean;
  /**
   * Adds a description to label
   */
  description?: React.ReactNode;
  /**
   * Override internal id
   */
  id?: string;
  /** Read only-state */
  readOnly?: boolean;
  size?: 'xsmall' | 'small' | 'medium';
} & Pick<HTMLAttributes<HTMLElement>, 'aria-describedby'>;

export type FormField = {
  hasError: boolean;
  errorId: string;
  descriptionId: string;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  readOnly?: boolean;
  size?: 'xsmall' | 'small' | 'medium';
};

/**
 * Handles props and their state for various form-fields in context with Fieldset
 */
export const useFormField = (
  props: FormFieldProps,
  prefix: string,
): FormField => {
  const { error, size } = props;

  const fieldset = useContext(FieldsetContext);

  const randomId = useId();

  const id = props.id ?? `${prefix}-${randomId}`;
  const errorId = props.errorId ?? `${prefix}-error-${randomId}`;
  const descriptionId = `${prefix}-description-${randomId}`;

  const disabled = fieldset?.disabled || props.disabled;
  const readOnly =
    ((fieldset?.readOnly || props.readOnly) && !disabled) || undefined;

  const hasError = !disabled && !readOnly && !!(error || fieldset?.error);

  return {
    hasError,
    errorId,
    descriptionId,
    readOnly,
    size: size ?? fieldset?.size ?? 'medium',
    inputProps: {
      id,
      disabled,
      'aria-invalid': hasError ? true : undefined,
      'aria-describedby':
        cl(props['aria-describedby'], {
          [descriptionId]:
            !!props?.description && typeof props?.description === 'string',
          [errorId]: hasError,
          [fieldset?.errorId ?? '']: hasError && !!fieldset?.error,
        }) || undefined,
    },
  };
};
