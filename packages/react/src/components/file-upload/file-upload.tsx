import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { Field, FieldDescription } from '../field';
import { Label } from '../label/label';
import { ValidationMessage } from '../validation-message/validation-message';

export type FileUploadProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /** Instances of `FileUpload.Button`, `FileUpload.Label`, `FileUpload.Description`, `FileUpload.Input` or other React nodes */
    children: ReactNode;
    /**
     * Label
     */
    label?: ReactNode;
    /**
     * Description
     */
    description?: ReactNode;
    /**
     * Error message for field
     */
    error?: ReactNode;
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
      error,
      'data-size': size,
      'data-color': color,
      label,
      description,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <Field
        className={className}
        data-size={size}
        style={style}
        data-color={color}
      >
        {!!label && <Label>{label}</Label>}
        {!!description && <FieldDescription>{description}</FieldDescription>}
        <div
          ref={ref}
          className={`ds-file-upload`}
          data-field='description'
          {...rest}
        >
          {children}
        </div>
        {!!error && <ValidationMessage>{error}</ValidationMessage>}
      </Field>
    );
  },
);
