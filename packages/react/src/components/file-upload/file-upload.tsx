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
/* @Todo: field required? */
/**
 * FileUpload component to present a file upload area.
 *
 * @example
 * <FileUpload>
 *    <CloudUpIcon aria-hidden='true' />
 *    <FileUpload.Label aria-hidden='true'>Drop file here</FileUpload.Label>
 *    <FileUpload.Description>
 *      File must be in csv format and less than 2MB
 *    </FileUpload.Description>
 *    <FileUpload.Button>Upload file</FileUpload.Button>
 *    <FileUpload.Input />
 *  </FileUpload>
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  function FileUpload(
    {
      className,
      style,
      'data-size': size,
      'data-color': color,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cl(`ds-file-upload`, className)}
        style={style}
        data-size={size}
        data-color={color}
        data-field='description'
        {...rest}
      >
        {children}
      </div>
    );
  },
);
