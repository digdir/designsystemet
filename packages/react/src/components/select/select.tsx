import cl from 'clsx/lite';
import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type SelectProps = MergeRight<
  Omit<DefaultProps, 'data-color'> &
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'multiple' | 'size'>, // Also Omit size as this sets amount of visible options in multiselect
  {
    /**
     * Defines if the select is readOnly
     * @deprecated Use `aria-readonly` instead.
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
  function Select(
    { className, onKeyDown, onMouseDown, width, readOnly, ...rest },
    ref,
  ) {
    return (
      <select
        className={cl('ds-input', className)}
        aria-readonly={rest['aria-readonly'] ?? readOnly}
        data-width={width}
        ref={ref}
        {...rest}
      />
    );
  },
);
