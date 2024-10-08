import cl from 'clsx/lite';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type InputAttr = InputHTMLAttributes<HTMLInputElement>;
export type InputProps = {
  /**
   * Changes field size and paddings
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
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
} & Omit<InputAttr, 'size' | 'prefix' | 'role' | 'type'> &
  (
    | { type: 'checkbox' | 'radio'; role?: 'switch' | InputAttr['role'] }
    | {
        type?: Omit<InputAttr['type'], 'checkbox' | 'radio'> | never;
        role?: Omit<InputAttr['role'], 'switch'>;
      }
  );

/** Input field
 *
 * @example
 * ```tsx
 * <Input />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = 'text', size = 'md', htmlSize = 20, className, ...rest },
  ref,
) {
  return (
    <input
      className={cl(`ds-input`, className)}
      data-size={size}
      ref={ref}
      size={htmlSize}
      type={type}
      {...rest}
    />
  );
});
