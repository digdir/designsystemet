import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type FileUploadProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLInputElement>,
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
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
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
      <label
        className={cl(`ds-file-upload`, className)}
        style={style}
        data-size={size}
        data-color={color}
      >
        {children}
        <input ref={ref} type='file' className='ds-sr-only' {...rest} />
      </label>
    );
  },
);
