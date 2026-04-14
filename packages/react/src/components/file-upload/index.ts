import { FileUpload as FileUploadParent } from './file-upload';
import { FileUploadButton } from './file-upload-button';
import { FileUploadDescription } from './file-upload-description';
import { FileUploadInput } from './file-upload-input';

type FileUpload = typeof FileUploadParent & {
  /**
   * Use `FileUpload.Button` to add a fake button for click affordance
   *
   * Place as a descendant of `FileUpload`
   *
   * @example
   * <FileUpload>
   *   <FileUpload.Button>Upload file</FileUpload.Button>
   * </FileUpload>
   */
  Button: typeof FileUploadButton;
  /**
   * Use `FileUpload.Description` to add secondary text inside FileUpload
   *
   * Place as a descendant of `FileUpload`
   *
   * @example
   * <FileUpload>
   *   <FileUpload.Description>File must be in csv format and less than 2MB</FileUpload.Description>
   * </FileUpload>
   */
  Description: typeof FileUploadDescription;
  /**
   * Use `FileUpload.Input` to render the hidden file input
   *
   * Place as a descendant of `FileUpload`. Accepts all native `<input>` props
   * including `accept`, `multiple`, `disabled`, `readOnly` and `capture`.
   *
   * @example
   * <FileUpload>
   *   <FileUpload.Input accept='.pdf' multiple />
   * </FileUpload>
   */
  Input: typeof FileUploadInput;
};
/**
 * FileUpload component to present a file upload area.
 *
 * @example
 * <FileUpload>
 *  <FileUpload.Description>Drop file here</FileUpload.Description>
 *  <FileUpload.Description>File must be in csv format</FileUpload.Description>
 *  <FileUpload.Button>Upload file</FileUpload.Button>
 * </FileUpload>
 */
const FileUploadComponent: FileUpload = Object.assign(FileUploadParent, {
  Button: FileUploadButton,
  Description: FileUploadDescription,
  Input: FileUploadInput,
});

FileUploadComponent.Button.displayName = 'FileUpload.Button';
FileUploadComponent.Description.displayName = 'FileUpload.Description';
FileUploadComponent.Input.displayName = 'FileUpload.Input';

export type { FileUploadProps } from './file-upload';
export type { FileUploadButtonProps } from './file-upload-button';
export type { FileUploadDescriptionProps } from './file-upload-description';
export type { FileUploadInputProps } from './file-upload-input';
export { FileUploadComponent as FileUpload };
