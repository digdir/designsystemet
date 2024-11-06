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
>(function FieldAffixWrapper({ className, ...rest }, ref) {
  return (
    <div className={cl('ds-field-affix', className)} ref={ref} {...rest} />
  );
});

export type FieldAffixProps = Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>;

export const FieldAffix = forwardRef<HTMLSpanElement, FieldAffixProps>(
  function FieldAffix(rest, ref) {
    return <span aria-hidden='true' data-affix ref={ref} {...rest} />;
  },
);
