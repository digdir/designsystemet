import { FileUpload as FileUploadParent } from './file-upload';
import { FileUploadButton } from './file-upload-button';
import { FileUploadDescription } from './file-upload-description';
import { FileUploadLabel } from './file-upload-label';

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
   * Use `FileUpload.Label` to add primary text inside FileUpload
   *
   * Place as a descendant of `FileUpload`
   *
   * @example
   * <FileUpload>
   *   <FileUpload.Label>Drop file here</FileUpload.Label>
   * </FileUpload>
   */
  Label: typeof FileUploadLabel;
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
};
/**
 * FileUpload component to present a file upload area.
 *
 * @example
 * <FileUpload>
 *  <FileUpload.Label>Drop file here</FileUpload.Label>
 *  <FileUpload.Description>File must be in csv format</FileUpload.Description>
 *  <FileUpload.Button>Upload file</FileUpload.Button>
 * </FileUpload>
 */
const FileUploadComponent: FileUpload = Object.assign(FileUploadParent, {
  Button: FileUploadButton,
  Label: FileUploadLabel,
  Description: FileUploadDescription,
});

FileUploadComponent.Button.displayName = 'FileUpload.Button';
FileUploadComponent.Label.displayName = 'FileUpload.Label';
FileUploadComponent.Description.displayName = 'FileUpload.Description';

export type { FileUploadProps } from './file-upload';
export type { FileUploadButtonProps } from './file-upload-button';
export type { FileUploadDescriptionProps } from './file-upload-description';
export type { FileUploadLabelProps } from './file-upload-label';
export { FileUploadComponent as FileUpload };
