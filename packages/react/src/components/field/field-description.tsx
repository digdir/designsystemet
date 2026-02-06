import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type FieldDescriptionProps = HTMLAttributes<HTMLDivElement>;

/**
 * Field description component, used to provide additional information below the input.
 *
 * @example
 * <FieldDescription>Additional information</FieldDescription>
 */
export const FieldDescription = forwardRef<
  HTMLDivElement,
  FieldDescriptionProps
>(function FieldDescription(rest, ref) {
  return (
    <div
      suppressHydrationWarning // Since <ds-field> adds attributes
      data-field='description'
      ref={ref}
      {...rest}
    />
  );
});
