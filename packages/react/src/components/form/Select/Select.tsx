import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

export type SelectProps = {
  /**
   * Defines the size of the select.
   * @default md
   **/
  size?: 'sm' | 'md' | 'lg';
  /** Defines if the select is readOnly
   * @default false
   */
  readOnly?: boolean;
  /** Exposes the HTML `size` attribute.
   * @default 0
   */
  htmlSize?: number;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'multiple'>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, htmlSize, size, ...rest }, ref) {
    return (
      <select
        className={cl('ds-input', className)}
        data-size={size}
        ref={ref}
        size={htmlSize}
        {...rest}
      />
    );
  },
);
