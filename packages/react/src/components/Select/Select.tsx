import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type SelectProps = MergeRight<
  Omit<DefaultProps, 'data-color'> &
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'multiple' | 'size'>, // Also Omit size as this sets amount of visible options in multiselect
  {
    /**
     * Defines if the select is readOnly
     * @default false
     */
    readOnly?: boolean;
    /**
     * Defines the width of Select, where "auto" matches the content width.
     * @default full
     */
    width?: 'full' | 'auto';
  }
>;

/**
 * Select component, used to display a native select.
 *
 * @example
 * <Select>
 *   <Select.Option value='1'>Option 1</Select.Option>
 *   <Select.Option value='2'>Option 2</Select.Option>
 * </Select>
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, onKeyDown, onMouseDown, width, ...rest }, ref) {
    return (
      <select
        className={cl('ds-input', className)}
        data-width={width}
        ref={ref}
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
