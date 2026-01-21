import { forwardRef } from 'react';
import type { ValidationMessageProps } from '../validation-message/validation-message';

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
   * Text for screen readers of how many characters are allowed.
   * Only read when entering the field.
   *
   * @default 'Maks %d tegn tillatt.'
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
    {
      limit,
      under = '%d tegn igjen',
      over = '%d tegn for mye',
      hint = 'Maks %d tegn tillatt.',
      ...rest
    },
    _ref,
  ) {
    return (
      <p
        suppressHydrationWarning // Since <ds-field> adds attributes
        data-field='counter'
        data-limit={limit}
        data-under={under}
        data-over={over}
        data-hint={hint}
        {...rest}
      />
    );
  },
);
