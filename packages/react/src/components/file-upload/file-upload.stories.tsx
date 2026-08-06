import { CircleSlashIcon } from '@navikt/aksel-icons';
import { type DragEvent, useRef, useState } from 'react';
import type { FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { Button, Field, Label } from '../';
import { EXPERIMENTAL_FileUpload as FileUpload } from './';

const meta = preview.meta({
  title: 'Komponenter/FileUpload',
  component: FileUpload,
  parameters: {
    customStyles: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 'var(--ds-size-4)',
    },
  },
});

export const Preview = meta.story({
  render: ({ ...args }) => (
    <Field>
      <Label>Upload file</Label>
      <FileUpload {...args}>
        <Field.Description>Drop file here</Field.Description>
        <Field.Description>
          File must be in csv format and less than 2MB
        </Field.Description>
        <Button asChild data-variant='secondary'>
          <span>Upload file</span>
        </Button>
        <input type='file' />
      </FileUpload>
    </Field>
  ),
});

export const Variants = meta.story(() => (
  <>
    <Field>
      <Label>color variant default</Label>
      <FileUpload>
        <Field.Description>Drop file here</Field.Description>
        <Field.Description>
          File must be in csv format and less than 2MB
        </Field.Description>
        <Button asChild data-variant='secondary'>
          <span>Upload file</span>
        </Button>
        <input type='file' />
      </FileUpload>
    </Field>
    <Field>
      <Label>color variant neutral</Label>
      <FileUpload data-color='neutral'>
        <Field.Description>Drop file here</Field.Description>
        <Field.Description>
          File must be in csv format and less than 2MB
        </Field.Description>
        <Button asChild data-variant='secondary'>
          <span>Upload file</span>
        </Button>
        <input type='file' />
      </FileUpload>
    </Field>
  </>
));
export const LinkAlt = meta.story(() => (
  <Field>
    <Label>Upload file</Label>
    <FileUpload>
      <Field.Description>
        Drop files or <span className='ds-link'>click to browse</span>
      </Field.Description>
      <Field.Description>
        File must be in csv format and less than 2MB
      </Field.Description>
      <input type='file' />
    </FileUpload>
  </Field>
));

export const ReadOnly = meta.story(() => (
  <Field>
    <Label>Upload file</Label>
    <Field.Description>description text</Field.Description>
    <FileUpload>
      <Field.Description>Upload limit reached</Field.Description>
      <Button asChild data-variant='secondary'>
        <span>Upload file</span>
      </Button>
      <input type='file' readOnly={true} />
    </FileUpload>
  </Field>
));

export const HiddenLabel = meta.story(() => (
  <Field>
    <Label className='ds-sr-only'>Upload file</Label>
    <Field.Description>description text</Field.Description>
    <FileUpload>
      <Field.Description>Drop file here</Field.Description>
      <Field.Description>
        File must be in csv format and less than 2MB
      </Field.Description>
      <Button asChild data-variant='secondary'>
        <span>Upload file</span>
      </Button>
      <input type='file' />
    </FileUpload>
  </Field>
));

export const WorkingExample = meta.story(() => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const addFiles = (files: FileList) => {
    setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    setIsReadOnly(true);
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      addFiles(event.target.files);
      event.target.value = '';
    }
  };

  const handleReset = () => {
    setUploadedFiles([]);
    setIsReadOnly(false);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ minWidth: '300px' }}>
      <Field>
        <Label>Upload profile picture</Label>
        <FileUpload
          onDragOver={(event: React.DragEvent<HTMLElement>) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
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
              <Field.Description>
                {isDragging ? 'Drop file to upload' : 'Drop file here'}
              </Field.Description>
              <Field.Description>File must be in svg format</Field.Description>
              <Button asChild data-variant='secondary'>
                <span>Upload file</span>
              </Button>
            </>
          )}
          <input
            type='file'
            ref={fileInputRef}
            accept='.svg'
            readOnly={isReadOnly}
            onChange={handleChange}
          />
        </FileUpload>
      </Field>
      {uploadedFiles.length > 0 && (
        <>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={`${file.name}-${file.lastModified}-${index}`}>
                {file.name}
              </li>
            ))}
          </ul>
          <Button onClick={handleReset}>Clear file</Button>
        </>
      )}
    </div>
  );
});

export const ReactDropZoneExample = meta.story(() => {
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
        <FileUpload>
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
        </FileUpload>
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
});
