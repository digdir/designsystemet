import cl from 'clsx/lite';
import type { HTMLAttributes, InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type InputAffixWrapperProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'prefix'
>;
export const InputAffixWrapper = forwardRef<
  HTMLDivElement,
  InputAffixWrapperProps
>(function InputAddons({ className, ...rest }, ref) {
  return (
    <div className={cl('ds-input-affix', className)} ref={ref} {...rest} />
  );
});

export type InputAffixProps = Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>;
export const InputAffix = forwardRef<HTMLSpanElement, InputAffixProps>(
  function InputAffix(rest, ref) {
    return <span aria-hidden='true' ref={ref} {...rest} />;
  },
);
