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
  /** If `true` a `textarea` is rendered for multiline support. Make sure to use `textareaRef` if you need to access reference element  */
  multiline?: boolean;
  'data-size'?: 'sm' | 'md' | 'lg';
};

type TextareaTypes = {
  /** If `true` a `textarea` is rendered for multiline support. Make sure to use `textareaRef` if you need to access reference element  */
  multiline: true;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

type InputTypes = {
  /** If `true` a `textarea` is rendered for multiline support. Make sure to use `textareaRef` if you need to access reference element  */
  multiline?: never;
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
  const { label, description, validation } = props;

  return (
    <Field>
      {!!label && <Label weight='regular'>{label}</Label>}
      {!!description && <div data-field='description'>{description}</div>}
      {props.multiline === true ? (
        <Textarea ref={ref as ForwardedRef<HTMLTextAreaElement>} {...props} />
      ) : (
        <Input ref={ref as ForwardedRef<HTMLInputElement>} {...props} />
      )}
      {!!validation && <ValidationMessage>{validation}</ValidationMessage>}
    </Field>
  );
});
