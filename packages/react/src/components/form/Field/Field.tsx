import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import type { DefaultProps } from '../../../types';
import { fieldObserver } from './fieldObserver';

export type FieldProps = {
  /** Position of toggle inputs (radio, checkbox, switch) in field
   * @default start
   */
  position?: 'start' | 'end';
} & HTMLAttributes<HTMLDivElement> &
  DefaultProps;

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { className, ...rest },
  ref,
) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const mergedRefs = useMergeRefs([fieldRef, ref]);
  useEffect(() => fieldObserver(fieldRef.current), []);

  return (
    <div className={cl('ds-field', className)} ref={mergedRefs} {...rest} />
  );
});
