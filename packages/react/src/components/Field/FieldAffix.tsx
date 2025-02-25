import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type FieldAffixesProps = Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>;

/**
 * FieldAffixes component, used to wrap a form field.
 *
 * @example
 * <Field.Affixes>
 *   <Field.Affix>NOK</Field.Affix>
 *   <Input />
 *   <Field.Affix>pr. mnd.</Field.Affix>
 * </Field.Affixes>
 */
export const FieldAffixes = forwardRef<HTMLDivElement, FieldAffixesProps>(
  function FieldAffixes({ className, ...rest }, ref) {
    return (
      <div className={cl('ds-field-affixes', className)} ref={ref} {...rest} />
    );
  },
);

export type FieldAffixProps = Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>;

/**
 * FieldAffix component, used to wrap a form field.
 * Use together with Field.Affixes.
 *
 * @example
 * <Field.Affixes>
 *   <Field.Affix>NOK</Field.Affix>
 *   <Input />
 *   <Field.Affix>pr. mnd.</Field.Affix>
 * </Field.Affixes>
 */
export const FieldAffix = forwardRef<HTMLSpanElement, FieldAffixProps>(
  function FieldAffix({ className, ...rest }, ref) {
    return (
      <span
        className={cl('ds-field-affix', className)}
        aria-hidden='true'
        ref={ref}
        {...rest}
      />
    );
  },
);
