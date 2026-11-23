import cl from 'clsx/lite';
import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  DefaultProps;

/**
 * Native HTML textarea element.
 *
 * @example
 * <Textarea />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...rest }, ref) {
    return (
      <textarea
        suppressHydrationWarning // Since <ds-field> adds attributes
        className={cl('ds-input', className)}
        ref={ref}
        {...rest}
      />
    );
  },
);
