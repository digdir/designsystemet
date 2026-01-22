import { forwardRef } from 'react';
import {
  ValidationMessage,
  type ValidationMessageProps,
} from '../validation-message/validation-message';

export type FieldCounterProps = {
  /**
   * Label template for when `maxCount` is exceeded.
   * Use `%d` to insert the number of characters.
   *
   * @default '%d tegn for mye'
   */
  over?: string;
  /**
   * Label template for count.
   * Use `%d` to insert the number of characters.
   *
   * @default '%d tegn igjen'
   */
  under?: string;
  /**
   * @deprecated The hint attribute is deprecated.
   */
  hint?: string;
  /**
   * The maximum allowed characters.
   *
   * @default undefined
   **/
  limit: number;
} & ValidationMessageProps;
/**
 * FieldCounter component, used to display a counter for a form field.
 *
 * @example
 * <Field>
 *   <Input />
 *   <Field.Counter limit={100} under='%d tegn igjen' over='%d tegn for mye' />
 * </Field>
 */
export const FieldCounter = forwardRef<HTMLParagraphElement, FieldCounterProps>(
  function FieldCounter(
    { limit, under = '%d tegn igjen', over = '%d tegn for mye', hint, ...rest },
    _ref,
  ) {
    if (hint)
      console.warn(
        'Designsystemet: hint attribute is deprecated on Field.Counter',
      );
    return (
      <ValidationMessage
        suppressHydrationWarning // Since <ds-field> adds attributes
        data-field='counter'
        data-limit={limit}
        data-under={under}
        data-over={over}
        {...rest}
      />
    );
  },
);
