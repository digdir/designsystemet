import { CircleSlashIcon, CloudUpIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';
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
        <FileUpload.Label>Drop file here</FileUpload.Label>
        <FileUpload.Description>
          File must be in csv format and less than 2MB
        </FileUpload.Description>
        <FileUpload.Button>Upload file</FileUpload.Button>
      </FileUpload>
    );
  },
};

export const Variants: StoryFn<typeof FileUpload> = () => (
  <>
    <FileUpload>
      <CloudUpIcon aria-hidden='true' />
      <FileUpload.Label>Drop file here</FileUpload.Label>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.Button>Upload file</FileUpload.Button>
    </FileUpload>
    <FileUpload data-color='neutral'>
      <CloudUpIcon aria-hidden='true' />
      <FileUpload.Label>Drop file here</FileUpload.Label>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.Button>Upload file</FileUpload.Button>
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
  </FileUpload>
);

export const FieldTest: StoryFn<typeof FileUpload> = () => (
  <Field>
    <Label>Upload files</Label>
    <Field.Description>Inside Field</Field.Description>
    <FileUpload>
      <CloudUpIcon aria-hidden='true' />
      <FileUpload.Label>Drop file here</FileUpload.Label>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
      <FileUpload.Button>Upload file</FileUpload.Button>
    </FileUpload>
    <ValidationMessage>Invalid file format</ValidationMessage>
  </Field>
);

export const ReadOnly: StoryFn<typeof FileUpload> = () => (
  <>
    <Field>
      <Label>Upload files</Label>
      <Field.Description>Inside Field</Field.Description>
      <FileUpload readOnly={true}>
        <CloudUpIcon aria-hidden='true' />
        <FileUpload.Label>Drop file here</FileUpload.Label>
        <FileUpload.Description>
          File must be in csv format and less than 2MB
        </FileUpload.Description>
        <FileUpload.Button>Upload file</FileUpload.Button>
      </FileUpload>
      <ValidationMessage>Invalid file format</ValidationMessage>
    </Field>
    <FileUpload readOnly={true}>
      <CloudUpIcon aria-hidden='true' />
      <FileUpload.Label>
        Drop files or <span className='ds-link'>click to browse</span>
      </FileUpload.Label>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
    </FileUpload>
  </>
);

export const Disabled: StoryFn<typeof FileUpload> = () => (
  <>
    <Field>
      <Label>Upload files</Label>
      <Field.Description>Inside Field</Field.Description>
      <FileUpload disabled={true}>
        <CloudUpIcon aria-hidden='true' />
        <FileUpload.Label>Drop file here</FileUpload.Label>
        <FileUpload.Description>
          File must be in csv format and less than 2MB
        </FileUpload.Description>
        <FileUpload.Button>Upload file</FileUpload.Button>
      </FileUpload>
      <ValidationMessage>Invalid file format</ValidationMessage>
    </Field>
    <FileUpload disabled={true}>
      <CloudUpIcon aria-hidden='true' />
      <FileUpload.Label>
        Drop files or <span className='ds-link'>click to browse</span>
      </FileUpload.Label>
      <FileUpload.Description>
        File must be in csv format and less than 2MB
      </FileUpload.Description>
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

  const handleChange = (event: ChangeEvent<HTMLLabelElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (target.files && target.files.length > 0) {
      addFiles(target.files);
    }
  };

  const handleReset = () => {
    setUploadedFiles([]);
    setIsReadOnly(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <FileUpload
        ref={fileInputRef}
        accept='.svg'
        readOnly={isReadOnly}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onChange={handleChange}
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
            <FileUpload.Label>
              {isDragging ? 'Drop file to upload' : 'Drop file here'}
            </FileUpload.Label>
            <FileUpload.Description>
              File must be in svg format
            </FileUpload.Description>
            <FileUpload.Button>Upload file</FileUpload.Button>
          </>
        )}
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
