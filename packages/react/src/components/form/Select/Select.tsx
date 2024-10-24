import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import type { Size } from '../../../types';

export type SelectProps = {
  /**
   * Defines the size of the select.
   * @default md
   **/
  size?: Size;
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
  function Select(
    { className, htmlSize, onKeyDown, onMouseDown, size, ...rest },
    ref,
  ) {
    return (
      <select
        className={cl('ds-input', className)}
        data-size={size}
        ref={ref}
        size={htmlSize}
        onKeyDown={(event) => {
          if (event.key === 'Tab') return;
          if (rest.readOnly) event.preventDefault(); // Make readonly work for select
          onKeyDown?.(event);
        }}
        onMouseDown={(event) => {
          if (rest.readOnly) event.preventDefault(); // Make readonly work for select
          onMouseDown?.(event);
        }}
        {...rest}
      />
    );
  },
);
