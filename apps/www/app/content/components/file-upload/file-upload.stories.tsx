import {
  Button,
  EXPERIMENTAL_FileUpload,
  Field,
  Label,
} from '@digdir/designsystemet-react';
import { CircleSlashIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { type FileRejection, useDropzone } from 'react-dropzone';

export const Preview = () => (
  <Field>
    <Label>Last opp profilbilde</Label>
    <Field.Description>
      Filen må være i csv-format og mindre enn 2MB
    </Field.Description>
    <EXPERIMENTAL_FileUpload>
      <Field.Description>Slipp fil her</Field.Description>
      <Button asChild data-variant='secondary'>
        <span>Last opp fil</span>
      </Button>
      <input type='file' />
    </EXPERIMENTAL_FileUpload>
  </Field>
);

export const PreviewEn = () => (
  <Field>
    <Label>Upload profile picture</Label>
    <Field.Description>
      File must be in csv format and less than 2MB
    </Field.Description>
    <EXPERIMENTAL_FileUpload>
      <Field.Description>Drop file here</Field.Description>
      <Button asChild data-variant='secondary'>
        <span>Upload file</span>
      </Button>
      <input type='file' />
    </EXPERIMENTAL_FileUpload>
  </Field>
);

export const FileUploadExample = () => (
  <Field>
    <Label>Last opp profilbilde</Label>
    <Field.Description>beskrivelsestekst</Field.Description>
    <EXPERIMENTAL_FileUpload>
      <Field.Description>Slipp fil her</Field.Description>
      <Field.Description>
        Filen må være i csv-format og mindre enn 2MB
      </Field.Description>
      <Button asChild data-variant='secondary'>
        <span>Last opp fil</span>
      </Button>
      <input type='file' />
    </EXPERIMENTAL_FileUpload>
  </Field>
);

export const FileUploadExampleEn = () => (
  <Field>
    <Label>Upload profile picture</Label>
    <Field.Description>description text</Field.Description>
    <EXPERIMENTAL_FileUpload>
      <Field.Description>Drop file here</Field.Description>
      <Field.Description>
        File must be in csv format and less than 2MB
      </Field.Description>
      <Button asChild data-variant='secondary'>
        <span>Upload file</span>
      </Button>
      <input type='file' />
    </EXPERIMENTAL_FileUpload>
  </Field>
);

export const ReactDropZoneExample = () => {
  const MAX_FILES = 3;
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<FileRejection[]>([]);
  const isReadOnly = files.length >= MAX_FILES;
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDropAccepted: (newFiles) => {
        setFiles((prev) => {
          const remaining = MAX_FILES - prev.length;
          return [...prev, ...newFiles.slice(0, remaining)];
        });
      },
      onDropRejected: (rej) => {
        setRejected((prev) => [...prev, ...rej]);
      },
      accept: {
        'image/svg+xml': ['.svg'],
      },
      maxFiles: MAX_FILES,
      disabled: isReadOnly,
    });

  return (
    <div style={{ minWidth: '300px' }}>
      {/* When using react-dropzone, it is important to apply the getRootProps to the
       Field component and not the FileUpload component so screenreaders see the Label.
        This should be noted in the docs */}
      <Field {...getRootProps()}>
        <Label>Upload profile picture</Label>
        <EXPERIMENTAL_FileUpload>
          {isReadOnly && (
            <>
              <CircleSlashIcon aria-hidden='true' />
              <Field.Description>
                You can not upload more files
              </Field.Description>
            </>
          )}
          {!isReadOnly && (
            <>
              {isDragReject && <CircleSlashIcon aria-hidden='true' />}
              <Field.Description>
                {isDragReject
                  ? 'File type not accepted'
                  : isDragActive
                    ? 'Drop file(s) here'
                    : 'Drop file(s) or click to upload'}
              </Field.Description>
              <Field.Description>
                File must be <code>.svg</code>, {MAX_FILES - files.length} of{' '}
                {MAX_FILES} files remaining
              </Field.Description>
              <Button asChild data-variant='secondary'>
                <span>Upload file</span>
              </Button>
            </>
          )}

          <input
            {...getInputProps({
              readOnly: isReadOnly,
              'aria-invalid': isDragReject,
            })}
          />
        </EXPERIMENTAL_FileUpload>
      </Field>
      {files.length > 0 && (
        <>
          <p>Accepted files</p>
          <ul>
            {files.map((file) => (
              <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
            ))}
          </ul>
        </>
      )}
      {rejected.length > 0 && (
        <>
          <p>Rejected files</p>
          <ul>
            {rejected.map(({ file, errors }) => (
              <li key={`${file.name}-${file.lastModified}`}>
                {file.name} — {errors.map((e) => e.message).join(', ')}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
