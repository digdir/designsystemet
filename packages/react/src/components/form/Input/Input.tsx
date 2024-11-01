import cl from 'clsx/lite';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../../types';

type InputAttr = InputHTMLAttributes<HTMLInputElement>;
export type InputProps = {
  /** Supported `input` types */
  type?: InputAttr['type'];
  /** Defines the width of input in count of characters.
   */
  size?: number;
  /** Disables element
   * @note Avoid using if possible for accessibility purposes
   */
  disabled?: boolean;
  /** Toggle `readOnly` */
  readOnly?: boolean;
  /** Set role, i.e. `switch` when `checkbox` or `radio` */
  role?: InputAttr['role'];
} & Omit<InputAttr, 'prefix' | 'role' | 'type'> &
  DefaultProps;

/** Input field
 *
 * @example
 * ```tsx
 * <Input />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = 'text', className, onChange, onClick, ...rest },
  ref,
) {
  return (
    <input
      className={cl(`ds-input`, className)}
      ref={ref}
      type={type}
      onChange={(event) => rest.readOnly || onChange?.(event)} // Make readonly work for checkbox / radio / switch
      onClick={(event) => {
        if (rest.readOnly) event.preventDefault(); // Make readonly work for checkbox / radio / switch
        onClick?.(event);
      }}
      {...rest}
    />
  );
});
