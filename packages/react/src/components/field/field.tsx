import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import type { DefaultProps } from '../../types';
import { useMergeRefs } from '../../utilities/hooks';
import { fieldObserver } from './fieldObserver';

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
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { className, position, asChild, ...rest },
  ref,
) {
  const Component = asChild ? Slot : 'div';
  const fieldRef = useRef<HTMLDivElement>(null);
  const mergedRefs = useMergeRefs([fieldRef, ref]);
  useEffect(() => fieldObserver(fieldRef.current), []);

  return (
    <Component
      className={cl('ds-field', className)}
      data-position={position}
      ref={mergedRefs}
      {...rest}
    />
  );
});
