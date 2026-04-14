import { forwardRef, type InputHTMLAttributes } from 'react';

export type FileUploadInputProps = InputHTMLAttributes<HTMLInputElement>;

export const FileUploadInput = forwardRef<
  HTMLInputElement,
  FileUploadInputProps
>(function FileUploadInput(rest, ref) {
  return (
    <input
      title='' // Hide native "No file choosen" tooltip on Mac
      type='file'
      ref={ref}
      {...rest}
    />
  );
});
