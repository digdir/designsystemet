import { FileUpload } from './file-upload';

/**
 * FileUpload component to present a file upload area.
 *
 * @example
 * <Field>
 *  <Label>Upload file</Label>
 *  <FileUpload>
 *    <CloudUpIcon aria-hidden='true' />
 *    <Field.Description>Drop file here</Field.Description>
 *    <Field.Description>
 *      File must be in csv format and less than 2MB
 *    </Field.Description>
 *    <Button asChild data-variant='secondary'>
 *      <span>Upload file</span>
 *    </Button>
 *    <input type="file" />
 *  </FileUpload>
 * </Field>
 */
const EXPERIMENTAL_FileUpload = FileUpload;

export type { FileUploadProps } from './file-upload';
export { EXPERIMENTAL_FileUpload };
