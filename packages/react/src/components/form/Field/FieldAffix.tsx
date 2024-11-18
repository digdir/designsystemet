import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type FieldAffixesProps = Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>;

export const FieldAffixes = forwardRef<HTMLDivElement, FieldAffixesProps>(
  function FieldAffixes({ className, ...rest }, ref) {
    return (
      <div className={cl('ds-field-affixes', className)} ref={ref} {...rest} />
    );
  },
);

export type FieldAffixProps = Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>;

export const FieldAffix = forwardRef<HTMLSpanElement, FieldAffixProps>(
  function FieldAffix(rest, ref) {
    return <span aria-hidden='true' ref={ref} {...rest} />;
  },
);
