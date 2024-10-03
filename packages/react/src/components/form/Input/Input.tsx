import cl from 'clsx/lite';
import type { HTMLAttributes, InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type InputProps = {
  /**
   * Changes field size and paddings
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
  /** Supported `input` types */
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
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
  /** Toggle `switch` attribute */
  role?: 'switch' | (string & {}); // (string & {}) for better IntelliSense - see https://stackoverflow.com/a/61048124
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

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

export type InputAddonsProps = Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>;
export const InputAddons = forwardRef<HTMLDivElement, InputAddonsProps>(
  function InputAddons({ className, ...rest }, ref) {
    return (
      <div className={cl('ds-input-addons', className)} ref={ref} {...rest} />
    );
  },
);
