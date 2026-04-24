import { Field, FileUpload, Label } from '@digdir/designsystemet-react';

export const FileUploadExample = () => (
  <Field>
    <Label>Upload profile picture</Label>
    <Field.Description>description text</Field.Description>
    <FileUpload>
      <FileUpload.Description>Drop file here</FileUpload.Description>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.FakeButton>Upload file</FileUpload.FakeButton>
      <FileUpload.Input />
    </FileUpload>
  </Field>
);

export const FileUploadReactDropzone = () => (
  <Field tabIndex={0}>
    <Label>Upload profile picture</Label>
    <Field.Description>description text</Field.Description>
    <FileUpload>
      <FileUpload.Description>Drop file here</FileUpload.Description>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.FakeButton>Upload file</FileUpload.FakeButton>
      <FileUpload.Input tabIndex={-1} />
    </FileUpload>
  </Field>
);
