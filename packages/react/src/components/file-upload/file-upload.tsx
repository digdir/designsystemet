import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type FileUploadProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /** Instances of `FileUpload.Button`, `FileUpload.Label`, `FileUpload.Description`, `FileUpload.Input` or other React nodes */
    children: ReactNode;
  }
>;
/**
 * FileUpload component to present a file upload area.
 *
 * @example
 * <Field>
 * <Label>Upload file</Label>
 *  <FileUpload>
 *    <CloudUpIcon aria-hidden='true' />
 *    <FileUpload.Label aria-hidden='true'>Drop file here</FileUpload.Label>
 *    <FileUpload.Description>
 *      File must be in csv format and less than 2MB
 *    </FileUpload.Description>
 *    <FileUpload.Button>Upload file</FileUpload.Button>
 *    <FileUpload.Input />
 *  </FileUpload>
 * </Field>
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  function FileUpload({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cl('ds-file-upload', className)} {...rest} />
    );
  },
);
