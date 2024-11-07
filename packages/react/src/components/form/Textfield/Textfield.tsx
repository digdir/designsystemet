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
  FieldDescription,
} from '../Field';
import { Input } from '../Input';
import { Textarea } from '../Textarea';

type SharedTextfieldProps = {
  /** Label */
  label?: ReactNode;
  /** Description */
  description?: ReactNode;
  /** Prefix */
  prefix?: string;
  /** Suffix */
  suffix?: string;
  /** Validation message. This will flag an error & assign `aria-invalid` */
  validation?: ReactNode;
} & DefaultProps;

type TextareaTypes = {
  /** Use to render a `textarea` instead of `input` for multiline support  */
  multiline: true;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

type InputTypes = {
  /** Use to render a `textarea` instead of `input` for multiline support  */
  multiline?: never | false;
} & InputHTMLAttributes<HTMLInputElement>;

export type TextfieldProps = SharedTextfieldProps &
  (TextareaTypes | InputTypes);

/**
 * Preconfigured `Field` for inputing text.
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
      ...rest
    },
    ref,
  ) => {
    const AffixWrapper = prefix || suffix ? FieldAffixWrapper : Fragment;

    return (
      <Field data-size={size}>
        {!!label && <Label>{label}</Label>}
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
        {!!validation && <ValidationMessage>{validation}</ValidationMessage>}
      </Field>
    );
  },
);
