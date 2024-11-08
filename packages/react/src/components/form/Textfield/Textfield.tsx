import { type ForwardedRef, type ReactNode, forwardRef } from 'react';

import type { DefaultProps } from '../../../types';
import { Label } from '../../Label';
import { ValidationMessage } from '../../ValidationMessage';
import {
  Field,
  FieldAffix,
  FieldAffixWrapper,
  type FieldCounterProps,
  FieldDescription,
} from '../Field';
import { Input, type InputProps } from '../Input';
import { Textarea, type TextareaProps } from '../Textarea';

type InputProps_ = Omit<InputProps, 'prefix'>;
type TextareaProps_ = Omit<TextareaProps, 'prefix'>;

type SharedTextfieldProps = {
  /** Label */
  label?: ReactNode;
  /** Description */
  description?: ReactNode;
  /** Prefix */
  prefix?: string;
  /** Suffix */
  suffix?: string;
  /** Error message for field */
  error?: ReactNode;
  /** Uses `Field.Counter` to display a character counter
   * Pass a number to set a limit, or an object to configure the counter
   */
  counter?: FieldCounterProps | number;
} & DefaultProps;

type TextfieldTextareaProps = {
  /** Use to render a `Textarea` instead of `Input` for multiline support  */
  multiline: true;
} & TextareaProps_;

type TextfieldInputProps = {
  /** Use to render a `Textarea` instead of `Input` for multiline support  */
  multiline?: never | false;
} & InputProps_;

export type TextfieldProps = SharedTextfieldProps &
  (TextfieldTextareaProps | TextfieldInputProps);

/**
 * Preconfigured `Field` for common configurations inputing text.
 * Rest props are passed to the `Input` or `Textarea` component.
 * @example
 * ```tsx
 * <Textfield label="Textfield label">
 * ```
 */
export const Textfield = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextfieldProps
>(function Textfield(
  {
    label,
    description,
    error,
    multiline,
    prefix,
    suffix,
    'data-size': size,
    counter,
    ...rest
  },
  ref,
) {
  return (
    <Field data-size={size}>
      {!!label && <Label>{label}</Label>}
      {!!description && <FieldDescription>{description}</FieldDescription>}
      <FieldAffixWrapper>
        {prefix === undefined || <FieldAffix>{prefix}</FieldAffix>}
        {multiline === true ? (
          <Textarea
            ref={ref as ForwardedRef<HTMLTextAreaElement>}
            aria-invalid={!!error}
            {...(rest as TextareaProps_)}
          />
        ) : (
          <Input
            ref={ref as ForwardedRef<HTMLInputElement>}
            aria-invalid={!!error}
            {...(rest as InputProps_)}
          />
        )}
        {suffix === undefined || <FieldAffix>{suffix}</FieldAffix>}
      </FieldAffixWrapper>
      {!!error && <ValidationMessage>{error}</ValidationMessage>}
      {!!counter && (
        <Field.Counter
          {...(typeof counter === 'number' ? { limit: counter } : counter)}
        />
      )}
    </Field>
  );
});
