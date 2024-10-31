import {
  type ForwardedRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  forwardRef,
} from 'react';

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
  'data-size'?: 'sm' | 'md' | 'lg';
};

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
>((props, ref) => {
  const { label, description, validation, multiline } = props;

  return (
    <Field>
      {!!label && <Label weight='regular'>{label}</Label>}
      {!!description && <div data-field='description'>{description}</div>}
      {multiline === true ? (
        <Textarea ref={ref as ForwardedRef<HTMLTextAreaElement>} {...props} />
      ) : (
        <Input ref={ref as ForwardedRef<HTMLInputElement>} {...props} />
      )}
      {!!validation && <ValidationMessage>{validation}</ValidationMessage>}
    </Field>
  );
});
