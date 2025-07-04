import cl from 'clsx/lite';
import type { FieldsetHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import type { DefaultProps } from '../../types';

export type FieldsetProps = DefaultProps &
  FieldsetHTMLAttributes<HTMLFieldSetElement>;

/**
 * Fieldset component, used to wrap a form field. Uses native `fieldset` element.
 *
 * @example
 * <Fieldset>
 *   <Fieldset.Legend>Skriv inn dine svar</Fieldset.Legend>
 *   <Fieldset.Description>
 *     Gi en kort beskrivelse i begge feltene
 *   </Fieldset.Description>
 *   <Field>
 *     <Label>Kort beskrivelse</Label>
 *     <Input />
 *   </Field>
 * </Fieldset>
 */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  function Fieldset({ className, ...rest }, ref) {
    return (
      <fieldset className={cl('ds-fieldset', className)} ref={ref} {...rest} />
    );
  },
);
