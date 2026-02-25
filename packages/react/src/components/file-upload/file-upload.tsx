import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type FileUploadProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLLabelElement>,
  {
    /** Instances of `FileUpload.Button`, `FileUpload.label` or other React nodes */
    children: ReactNode;
  }
>;

/**
 * FileUpload component to present a file upload area.
 *
 * @example
 * <FileUpload>
 *    <CloudUpIcon aria-hidden='true' />
 *    <FileUpload.Label>Drop file here</FileUpload.Label>
 *    <FileUpload.Description>
 *      File must be in csv format and less than 2MB
 *    </FileUpload.Description>
 *    <FileUpload.Button>Upload file</FileUpload.Button>
 *  </FileUpload>
 */
export const FileUpload = forwardRef<HTMLLabelElement, FileUploadProps>(
  function FileUpload({ className, children, ...rest }, ref) {
    return (
      <label ref={ref} className={cl(`ds-file-upload`, className)} {...rest}>
        {children}
        <input type='file' hidden />
      </label>
    );
  },
);
