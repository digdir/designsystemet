import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type FieldAffixProps = {
  prefix?: string;
  suffix?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>;

export const FieldAffix = forwardRef<HTMLDivElement, FieldAffixProps>(
  function FieldAffix({ className, prefix, suffix, ...rest }, ref) {
    return (
      <div
        className={cl('ds-field-affix', className)}
        data-prefix={prefix}
        data-suffix={suffix}
        ref={ref}
        {...rest}
      />
    );
  },
);
