import { FileUpload as FileUploadParent } from './file-upload';
import { FileUploadDescription } from './file-upload-description';
import { FileUploadFakeButton } from './file-upload-fake-button';
import { FileUploadInput } from './file-upload-input';

type FileUpload = typeof FileUploadParent & {
  /**
   * Use `FileUpload.FakeButton` to add a fake button for click affordance
   *
   * Place as a descendant of `FileUpload`
   *
   * @example
   * <FileUpload>
   *   <FileUpload.FakeButton>Upload file</FileUpload.FakeButton>
   * </FileUpload>
   */
  FakeButton: typeof FileUploadFakeButton;
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
 *  <FileUpload.FakeButton>Upload file</FileUpload.FakeButton>
 * </FileUpload>
 */
const EXPERIMENTAL_FileUpload: FileUpload = Object.assign(FileUploadParent, {
  FakeButton: FileUploadFakeButton,
  Description: FileUploadDescription,
  Input: FileUploadInput,
});

EXPERIMENTAL_FileUpload.displayName = 'EXPERIMENTAL_FileUpload';
EXPERIMENTAL_FileUpload.FakeButton.displayName =
  'EXPERIMENTAL_FileUpload.FakeButton';
EXPERIMENTAL_FileUpload.Description.displayName =
  'EXPERIMENTAL_FileUpload.Description';
EXPERIMENTAL_FileUpload.Input.displayName = 'EXPERIMENTAL_FileUpload.Input';

export type { FileUploadProps } from './file-upload';
export type { FileUploadDescriptionProps } from './file-upload-description';
export type { FileUploadFakeButtonProps } from './file-upload-fake-button';
export type { FileUploadInputProps } from './file-upload-input';
export { EXPERIMENTAL_FileUpload };
