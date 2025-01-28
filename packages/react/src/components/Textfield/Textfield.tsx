import { type ForwardedRef, type ReactNode, forwardRef } from 'react';

import type { DefaultProps, LabelRequired } from '../../types';
import {
  Field,
  FieldAffix,
  FieldAffixes,
  type FieldCounterProps,
  FieldDescription,
} from '../Field';
import { Input, type InputProps } from '../Input';
import { Label } from '../Label';
import { Textarea, type TextareaProps } from '../Textarea';
import { ValidationMessage } from '../ValidationMessage';

type InputProps_ = Omit<
  InputProps,
  'prefix' | 'className' | 'style' | 'data-color' | 'type'
>;
type TextareaProps_ = Omit<TextareaProps, 'prefix' | 'className' | 'style'>;

type SharedTextfieldProps = {
  /**
   * Classname on the wrapper element `Field`
   */
  className?: InputProps['className'];
  /**
   * Style on the wrapper element `Field`
   * @default undefined
   */
  style?: InputProps['style'];
  /**
   * Label
   */
  label?: ReactNode;
  /**
   * Description
   */
  description?: ReactNode;
  /**
   * Prefix
   */
  prefix?: string;
  /**
   * Suffix
   */
  suffix?: string;
  /**
   * Error message for field
   */
  error?: ReactNode;
  /**
   * Uses `Field.Counter` to display a character counter
   * Pass a number to set a limit, or an object to configure the counter
   */
  counter?: FieldCounterProps | number;
} & LabelRequired &
  Omit<DefaultProps, 'data-color'>;

type TextfieldTextareaProps = {
  /**
   * Use to render a `Textarea` instead of `Input` for multiline support
   **/
  multiline: true;
} & TextareaProps_;

type TextfieldInputProps = {
  /**
   * Use to render a `Textarea` instead of `Input` for multiline support
   **/
  multiline?: never | false;
  /**
   * Supported `input` types
   *
   * @default 'text'
   * */
  type?: Omit<InputProps['type'], 'radio' | 'checkbox' | 'image'>;
} & InputProps_;

export type TextfieldProps = SharedTextfieldProps &
  (TextfieldTextareaProps | TextfieldInputProps);

/**
 *  Composed text input component using `Field`
 *
 * `classname` & `style` are passed to the wrapper elements.
 *
 * Rest props are passed to the `Input` or `Textarea` component.
 * @example
 * <Textfield label="Textfield label">
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
    style,
    className,
    ...rest
  },
  ref,
) {
  return (
    <Field className={className} data-size={size} style={style}>
      {!!label && <Label>{label}</Label>}
      {!!description && <FieldDescription>{description}</FieldDescription>}
      <FieldAffixes>
        {prefix === undefined || <FieldAffix>{prefix}</FieldAffix>}
        {multiline === true ? (
          <Textarea
            ref={ref as ForwardedRef<HTMLTextAreaElement>}
            aria-invalid={Boolean(error) || undefined}
            {...(rest as TextareaProps_)}
          />
        ) : (
          <Input
            ref={ref as ForwardedRef<HTMLInputElement>}
            aria-invalid={Boolean(error) || undefined}
            {...(rest as InputProps_)}
          />
        )}
        {suffix === undefined || <FieldAffix>{suffix}</FieldAffix>}
      </FieldAffixes>
      {!!error && <ValidationMessage>{error}</ValidationMessage>}
      {!!counter && (
        <Field.Counter
          {...(typeof counter === 'number' ? { limit: counter } : counter)}
        />
      )}
    </Field>
  );
});
