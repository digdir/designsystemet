import cl from 'clsx/lite';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { Size } from '../../../types';

type InputAttr = InputHTMLAttributes<HTMLInputElement>;
export type InputProps = {
  /**
   * Changes field size and paddings
   */
  size?: Size;
  /** Supported `input` types */
  type?: InputAttr['type'];
  /** Exposes the HTML `size` attribute.
   * @default 20
   */
  htmlSize?: number;
  /** Disables element
   * @note Avoid using if possible for accessibility purposes
   */
  disabled?: boolean;
  /** Toggle `readOnly` */
  readOnly?: boolean;
  /** Set role, i.e. `switch` when `checkbox` or `radio` */
  role?: InputAttr['role'];
} & Omit<InputAttr, 'size' | 'prefix' | 'role' | 'type'>;

/** Input field
 *
 * @example
 * ```tsx
 * <Input />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = 'text', size, htmlSize, className, onClick, ...rest },
  ref,
) {
  return (
    <input
      className={cl(`ds-input`, className)}
      data-size={size}
      ref={ref}
      size={htmlSize}
      type={type}
      onClick={(event) => {
        if (rest.readOnly) event.preventDefault(); // Make readonly work for checkbox / radio / switch
        onClick?.(event);
      }}
      {...rest}
    />
  );
});
