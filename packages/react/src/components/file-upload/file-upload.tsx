import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type FileUploadProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLLabelElement>,
  {
    /** Instances of `FileUpload.Button`, `FileUpload.Label`, `FileUpload.Description` or other React nodes */
    children: ReactNode;
    /** File input accept attribute */
    accept?: string;
    /** Allow multiple file selection */
    multiple?: boolean;
    /** Disable file input */
    disabled?: boolean;
    /** Capture attribute for file input */
    capture?: boolean | 'user' | 'environment';
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
      accept,
      multiple,
      disabled,
      capture,
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
        {...rest}
      >
        {children}
        <input
          ref={ref}
          type='file'
          className='ds-sr-only'
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          capture={capture}
        />
      </label>
    );
  },
);
