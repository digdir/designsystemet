import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

export type SelectProps = {
  /** Set to true to enable multiple selection. */
  multiple?: boolean;
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
  function Select({ className, size, htmlSize, ...rest }, ref) {
    return (
      <select
        data-size={size}
        size={htmlSize}
        className={cl('ds-select', className)}
        ref={ref}
        {...rest}
      />
    );
  },
);
