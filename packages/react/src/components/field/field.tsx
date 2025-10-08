import type { DsField } from '@digdir/designsystemet-wc';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

import '@digdir/designsystemet-wc';

export type FieldProps = {
  /**
   * Position of toggle inputs (radio, checkbox, switch) in field
   * @default start
   */
  position?: 'start' | 'end';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement> &
  DefaultProps;

/**
 * Field component, used to wrap a form field.
 *
 * @example
 * <Field>
 *   <Label>Kort beskrivelse</Label>
 *   <Field.Description>Beskrivelse</Field.Description>
 *   <Input />
 *   <ValidationMessage>Feilmelding</ValidationMessage>
 * </Field>
 */
export const Field = forwardRef<DsField, FieldProps>(function Field(
  { className, position, asChild, children, ...rest },
  ref,
) {
  return (
    <ds-field ref={ref} class='ds-field' data-position={position} {...rest}>
      {children}
    </ds-field>
  );
});
