import { Slot } from '@radix-ui/react-slot';
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
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   * @deprecated This is not supported anymore, as the element needs to be `ds-field`
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
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { className, position, asChild, ...rest },
  ref,
) {
  const Component = asChild ? Slot : 'ds-field';
  const fieldRef = useRef<HTMLDivElement>(null);
  const mergedRefs = useMergeRefs([fieldRef, ref]);

  return (
    <Component
      {...(asChild
        ? { className: cl('ds-field', className) }
        : { class: cl('ds-field', className) })}
      data-position={position}
      ref={mergedRefs}
      {...rest}
    />
  );
});
