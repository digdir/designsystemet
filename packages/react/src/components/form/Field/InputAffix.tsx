import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type FieldAffixWrapperProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'prefix'
>;
export const FieldAffixWrapper = forwardRef<
  HTMLDivElement,
  FieldAffixWrapperProps
>(function InputAddons({ className, ...rest }, ref) {
  return (
    <div className={cl('ds-input-affix', className)} ref={ref} {...rest} />
  );
});

export type FieldAffixProps = Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>;
export const FieldAffix = forwardRef<HTMLSpanElement, FieldAffixProps>(
  function FieldAffix(rest, ref) {
    return <span aria-hidden='true' ref={ref} {...rest} />;
  },
);
