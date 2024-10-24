import cl from 'clsx/lite';
import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { Size } from '../../../types';

export type TextareaProps = {
  /**
   * Defines the size of the select.
   * @default md
   **/
  size?: Size;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Textarea field
 *
 * @example
 * ```tsx
 * <Textarea />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, size, ...rest }, ref) {
    return (
      <textarea
        className={cl('ds-input', className)}
        data-size={size}
        ref={ref}
        {...rest}
      />
    );
  },
);
