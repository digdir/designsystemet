import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type FieldDescriptionProps = HTMLAttributes<HTMLDivElement>;

export const FieldDescription = forwardRef<
  HTMLDivElement,
  FieldDescriptionProps
>(function FieldDescription(rest, ref) {
  return <div data-field='description' ref={ref} {...rest} />;
});
