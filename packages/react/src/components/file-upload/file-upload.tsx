import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type FileUploadProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLLabelElement>,
  {
    /** Instances of `FileUpload.Button`, `FileUpload.Label`, `FileUpload.Description`, `FileUpload.Input` or other React nodes */
    children: ReactNode;
  }
>;

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
export const FileUpload = forwardRef<HTMLLabelElement, FileUploadProps>(
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
      // biome-ignore lint/a11y/noLabelWithoutControl: input is provided via the FileUpload.Input subcomponent
      <label
        ref={ref}
        className={cl(`ds-file-upload`, className)}
        style={style}
        data-size={size}
        data-color={color}
        {...rest}
      >
        {children}
      </label>
    );
  },
);
