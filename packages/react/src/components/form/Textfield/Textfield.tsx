import {
  type ForwardedRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  forwardRef,
} from 'react';

import type { DefaultProps } from '../../../types';
import { Label } from '../../Label';
import { ValidationMessage } from '../../ValidationMessage';
import { Field } from '../Field';
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
      ...rest
    },
    ref,
  ) => {
    return (
      <Field data-size={size}>
        {!!label && <Label weight='regular'>{label}</Label>}
        {!!description && <div data-field='description'>{description}</div>}
        {multiline === true ? (
          <Textarea
            ref={ref as ForwardedRef<HTMLTextAreaElement>}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <Input
            ref={ref as ForwardedRef<HTMLInputElement>}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {!!validation && <ValidationMessage>{validation}</ValidationMessage>}
      </Field>
    );
  },
);
