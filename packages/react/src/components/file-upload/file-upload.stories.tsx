import { CloudUpIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { Field, Label, ValidationMessage } from '../';
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
    <Field.Description>Some description</Field.Description>
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
