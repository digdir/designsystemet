import {
  type ForwardedRef,
  Fragment,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  forwardRef,
} from 'react';

import type { DefaultProps } from '../../../types';
import { Label } from '../../Label';
import { ValidationMessage } from '../../ValidationMessage';
import {
  Field,
  FieldAffix,
  FieldAffixWrapper,
  FieldCounter,
  type FieldCounterProps,
  FieldDescription,
  type FieldProps,
} from '../Field';
import { Input } from '../Input';
import { Textarea } from '../Textarea';

type SharedTextfieldProps = {
  /** Label */
  label?: ReactNode;
  /** Description */
  description?: ReactNode;
  /** Prefix for field. */
  prefix?: string;
  /** Suffix for field. */
  suffix?: string;
  /** Validation message for field */
  validation?: ReactNode;
  /**
   * Props for the wrapping field
   */
  fieldProps?: FieldProps;
  /**
   * Props for field counter
   */
  fieldCounterProps?: FieldCounterProps;
} & DefaultProps;

type TextareaTypes = {
  /** Use to render a `textarea` instead of `input` for multiline support  */
  multiline: true;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

type InputTypes = {
  multiline?: never | false;
} & InputHTMLAttributes<HTMLInputElement>;

export type TextfieldProps = SharedTextfieldProps &
  (TextareaTypes | InputTypes);

/** Text input field
 *
 * @example
 * ```tsx
 * <Textfield label="Textfield label">
 * ```
 */
export const Textfield = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextfieldProps
>(
  (
    {
      label,
      description,
      validation,
      multiline,
      prefix,
      suffix,
      'data-size': size,
      fieldProps,
      fieldCounterProps,
      ...rest
    },
    ref,
  ) => {
    const AffixWrapper = prefix || suffix ? FieldAffixWrapper : Fragment;

    return (
      <Field data-size={size} {...fieldProps}>
        {!!label && <Label weight='regular'>{label}</Label>}
        {!!description && <FieldDescription>{description}</FieldDescription>}
        <AffixWrapper>
          {prefix && <FieldAffix>{prefix}</FieldAffix>}
          {multiline === true ? (
            <Textarea
              ref={ref as ForwardedRef<HTMLTextAreaElement>}
              aria-invalid={!!validation}
              {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <Input
              ref={ref as ForwardedRef<HTMLInputElement>}
              aria-invalid={!!validation}
              {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {suffix && <FieldAffix>{suffix}</FieldAffix>}
        </AffixWrapper>
        {fieldCounterProps && <FieldCounter {...fieldCounterProps} />}
        {!!validation && <ValidationMessage>{validation}</ValidationMessage>}
      </Field>
    );
  },
);
