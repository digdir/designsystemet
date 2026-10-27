import cl from 'clsx/lite';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

export type SpinnerProps = {
  /**
   * Spinner size
   */
  'data-size'?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
} & ComponentPropsWithoutRef<'span'>;

/**
 * Spinner component used for indicating busy or indeterminate loading.
 *
 * @example
 * <Spinner aria-label='Loading users...' />
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner({ className, ...rest }: SpinnerProps, ref) {
    return <span className={cl('ds-spinner', className)} ref={ref} {...rest} />;
  },
);
