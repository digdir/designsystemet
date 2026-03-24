import cl from 'clsx/lite';
import { forwardRef, type InputHTMLAttributes } from 'react';

export type FileUploadInputProps = InputHTMLAttributes<HTMLInputElement>;

export const FileUploadInput = forwardRef<
  HTMLInputElement,
  FileUploadInputProps
>(function FileUploadInput({ ...rest }, ref) {
  return <input title='' type='file' ref={ref} {...rest} />;
});
