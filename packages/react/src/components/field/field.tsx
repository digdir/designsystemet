import type { DSFieldElement } from '@digdir/designsystemet-web';
import '@digdir/designsystemet-web'; // Import ds-breadcrumbs custom element
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useRef } from 'react';
import type { DefaultProps } from '../../types';
import { useMergeRefs } from '../../utilities/hooks';

export type FieldProps = {
  /**
   * Position of toggle inputs (radio, checkbox, switch) in field
   * @default start
   */
  position?: 'start' | 'end';
} & HTMLAttributes<DSFieldElement> &
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
export const Field = forwardRef<DSFieldElement, FieldProps>(function Field(
  { className, position, ...rest },
  ref,
) {
  const fieldRef = useRef<DSFieldElement>(null);
  const mergedRefs = useMergeRefs([fieldRef, ref]);

  return (
    <ds-field
      class={cl('ds-field', className)}
      suppressHydrationWarning // Since <ds-field> adds attributes
      data-position={position}
      ref={mergedRefs}
      {...rest}
    />
  );
});
