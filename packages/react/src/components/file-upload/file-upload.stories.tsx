import { CircleSlashIcon, CloudUpIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { type DragEvent, useRef, useState } from 'react';
import type { FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { Button, Field, Label, ValidationMessage } from '../';
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
      <FileUpload {...args}>
        <CloudUpIcon aria-hidden='true' />
        <FileUpload.Label aria-hidden='true'>Drop file here</FileUpload.Label>
        <FileUpload.Description>
          File must be in csv format and less than 2MB
        </FileUpload.Description>
        <FileUpload.Button>Upload file</FileUpload.Button>
        <FileUpload.Input />
      </FileUpload>
    );
  },
};

export const Variants: StoryFn<typeof FileUpload> = () => (
  <>
    <FileUpload>
      <CloudUpIcon aria-hidden='true' />
      <FileUpload.Label aria-hidden='true'>Drop file here</FileUpload.Label>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.Button>Upload file</FileUpload.Button>
      <FileUpload.Input />
    </FileUpload>
    <FileUpload data-color='neutral'>
      <CloudUpIcon aria-hidden='true' />
      <FileUpload.Label aria-hidden='true'>Drop file here</FileUpload.Label>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.Button>Upload file</FileUpload.Button>
      <FileUpload.Input />
    </FileUpload>
  </>
);
export const LinkAlt: StoryFn<typeof FileUpload> = () => (
  <FileUpload>
    <CloudUpIcon aria-hidden='true' />
    <FileUpload.Label>
      Drop files or <span className='ds-link'>click to browse</span>
    </FileUpload.Label>
    <FileUpload.Description>
      File must be in csv format and less than 2MB
    </FileUpload.Description>
    <FileUpload.Input />
  </FileUpload>
);

export const FieldTest: StoryFn<typeof FileUpload> = () => (
  <Field>
    <Label>Upload files</Label>
    <Field.Description>Inside Field</Field.Description>
    <FileUpload>
      <CloudUpIcon aria-hidden='true' />
      <FileUpload.Label aria-hidden='true'>Drop file here</FileUpload.Label>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.Button>Upload file</FileUpload.Button>
      <FileUpload.Input />
    </FileUpload>
    <ValidationMessage>Invalid file format</ValidationMessage>
  </Field>
);

export const ReadOnly: StoryFn<typeof FileUpload> = () => (
  <>
    <Field>
      <Label>Upload files</Label>
      <Field.Description>Inside Field</Field.Description>
      <FileUpload>
        <CloudUpIcon aria-hidden='true' />
        <FileUpload.Label aria-hidden='true'>Drop file here</FileUpload.Label>
        <FileUpload.Description>
          File must be in csv format and less than 2MB
        </FileUpload.Description>
        <FileUpload.Button>Upload file</FileUpload.Button>
        <FileUpload.Input readOnly={true} />
      </FileUpload>
      <ValidationMessage>Invalid file format</ValidationMessage>
    </Field>
    <FileUpload>
      <CloudUpIcon aria-hidden='true' />
      <FileUpload.Label>
        Drop files or <span className='ds-link'>click to browse</span>
      </FileUpload.Label>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.Input readOnly={true} />
    </FileUpload>
  </>
);

export const Disabled: StoryFn<typeof FileUpload> = () => (
  <>
    <Field>
      <Label>Upload files</Label>
      <Field.Description>Inside Field</Field.Description>
      <FileUpload>
        <CloudUpIcon aria-hidden='true' />
        <FileUpload.Label aria-hidden='true'>Drop file here</FileUpload.Label>
        <FileUpload.Description>
          File must be in csv format and less than 2MB
        </FileUpload.Description>
        <FileUpload.Button>Upload file</FileUpload.Button>
        <FileUpload.Input disabled={true} />
      </FileUpload>
      <ValidationMessage>Invalid file format</ValidationMessage>
    </Field>
    <FileUpload>
      <CloudUpIcon aria-hidden='true' />
      <FileUpload.Label aria-hidden='true'>
        Drop files or <span className='ds-link'>click to browse</span>
      </FileUpload.Label>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.Input disabled={true} />
    </FileUpload>
  </>
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

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
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
    <div style={{ minWidth: 'max(50vw, 300px)' }}>
      <FileUpload
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {isReadOnly && (
          <>
            <CircleSlashIcon aria-hidden='true' />
            <FileUpload.Label>You can not upload more files</FileUpload.Label>
          </>
        )}
        {!isReadOnly && (
          <>
            <CloudUpIcon aria-hidden='true' />
            <FileUpload.Label aria-hidden='true'>
              {isDragging ? 'Drop file to upload' : 'Drop file here'}
            </FileUpload.Label>
            <FileUpload.Description>
              File must be in svg format
            </FileUpload.Description>
            <FileUpload.Button>Upload file</FileUpload.Button>
          </>
        )}
        <FileUpload.Input
          ref={fileInputRef}
          accept='.svg'
          readOnly={isReadOnly}
          onChange={handleChange}
        />
      </FileUpload>
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
    <div style={{ minWidth: 'max(50vw, 300px)' }}>
      <FileUpload {...getRootProps()}>
        {isReadOnly && (
          <>
            <CircleSlashIcon aria-hidden='true' />
            <FileUpload.Label>You can not upload more files</FileUpload.Label>
          </>
        )}
        {!isReadOnly && (
          <>
            <CloudUpIcon aria-hidden='true' />
            <FileUpload.Label aria-hidden='true'>
              {isDragReject
                ? 'File type not accepted'
                : isDragActive
                  ? 'Drop file(s) here'
                  : 'Drop file(s) or click to upload'}
            </FileUpload.Label>
            <FileUpload.Description>
              SVG only, {MAX_FILES - files.length} of {MAX_FILES} files remaining
            </FileUpload.Description>
            <FileUpload.Button>Upload files</FileUpload.Button>
          </>
        )}

        <FileUpload.Input {...getInputProps()} readOnly={isReadOnly} />
      </FileUpload>
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
