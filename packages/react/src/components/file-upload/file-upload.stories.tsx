import { CircleSlashIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { type DragEvent, useRef, useState } from 'react';
import type { FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { Button, Field, Label } from '../';
import { FileUpload } from './';

type Story = StoryObj<typeof FileUpload>;

const meta: Meta<typeof FileUpload> = {
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
};

export default meta;

export const Preview: Story = {
  render: ({ ...args }) => {
    return (
      <Field>
        <Label className='ds-sr-only'>Upload file</Label>
        <FileUpload {...args}>
          <FileUpload.Description>Drop file here</FileUpload.Description>
          <FileUpload.Description>
            File must be in csv format and less than 2MB
          </FileUpload.Description>
          <FileUpload.FakeButton>Upload file</FileUpload.FakeButton>
          <FileUpload.Input />
        </FileUpload>
      </Field>
    );
  },
};

export const Variants: StoryFn<typeof FileUpload> = () => (
  <>
    <Field>
      <Label>color variant default</Label>
      <FileUpload>
        <FileUpload.Description>Drop file here</FileUpload.Description>
        <FileUpload.Description>
          File must be in csv format and less than 2MB
        </FileUpload.Description>
        <FileUpload.FakeButton>Upload file</FileUpload.FakeButton>
        <FileUpload.Input />
      </FileUpload>
    </Field>
    <Field>
      <Label>color variant neutral</Label>
      <FileUpload data-color='neutral'>
        <FileUpload.Description>Drop file here</FileUpload.Description>
        <FileUpload.Description>
          File must be in csv format and less than 2MB
        </FileUpload.Description>
        <FileUpload.FakeButton>Upload file</FileUpload.FakeButton>
        <FileUpload.Input />
      </FileUpload>
    </Field>
  </>
);
export const LinkAlt: StoryFn<typeof FileUpload> = () => (
  <Field>
    <Label>Upload file</Label>
    <FileUpload>
      <FileUpload.Description>
        Drop files or <span className='ds-link'>click to browse</span>
      </FileUpload.Description>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.Input />
    </FileUpload>
  </Field>
);

export const ReadOnly: StoryFn<typeof FileUpload> = () => (
  <Field>
    <Label>Upload file</Label>
    <Field.Description>description text</Field.Description>
    <FileUpload>
      <FileUpload.Description>Drop file here</FileUpload.Description>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.FakeButton>Upload file</FileUpload.FakeButton>
      <FileUpload.Input readOnly={true} />
    </FileUpload>
  </Field>
);

/* export const Disabled: StoryFn<typeof FileUpload> = () => (
  <Field>
    <Label>Upload file</Label>
    <Field.Description>description text</Field.Description>
    <FileUpload>
      <FileUpload.Description>
        Drop file here
      </FileUpload.Description>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.FakeButton>Upload file</FileUpload.FakeButton>
      <FileUpload.Input disabled={true} />
    </FileUpload>
    <ValidationMessage>Invalid file format</ValidationMessage>
  </Field>
); */

export const HiddenLabel: StoryFn<typeof FileUpload> = () => (
  <Field>
    <Label className='ds-sr-only'>Upload file</Label>
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

export const WorkingExample: StoryFn<typeof FileUpload> = () => {
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
              <FileUpload.Description>
                You can not upload more files
              </FileUpload.Description>
            </>
          )}
          {!isReadOnly && (
            <>
              <FileUpload.Description>
                {isDragging ? 'Drop file to upload' : 'Drop file here'}
              </FileUpload.Description>
              <FileUpload.Description>
                File must be in svg format
              </FileUpload.Description>
              <FileUpload.FakeButton>Upload file</FileUpload.FakeButton>
            </>
          )}
          <FileUpload.Input
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
};

export const ReactDropZoneExample: StoryFn<typeof FileUpload> = () => {
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
              <FileUpload.Description>
                You can not upload more files
              </FileUpload.Description>
            </>
          )}
          {!isReadOnly && (
            <>
              {isDragReject && <CircleSlashIcon aria-hidden='true' />}
              <FileUpload.Description>
                {isDragReject
                  ? 'File type not accepted'
                  : isDragActive
                    ? 'Drop file(s) here'
                    : 'Drop file(s) or click to upload'}
              </FileUpload.Description>
              <FileUpload.Description>
                File must be <code>.svg</code>, {MAX_FILES - files.length} of{' '}
                {MAX_FILES} files remaining
              </FileUpload.Description>
              <FileUpload.FakeButton>Upload files</FileUpload.FakeButton>
            </>
          )}

          <FileUpload.Input
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
};
