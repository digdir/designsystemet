import cl from 'clsx/lite';
import { forwardRef, type InputHTMLAttributes } from 'react';

export type FileUploadInputProps = InputHTMLAttributes<HTMLInputElement>;

export const FileUploadInput = forwardRef<
  HTMLInputElement,
  FileUploadInputProps
>(function FileUploadInput({ className, ...rest }, ref) {
  return (
    <input
      type='file'
      className={cl('ds-sr-only', className)}
      ref={ref}
      {...rest}
    />
  );
});
