import {
  Button,
  Field,
  EXPERIMENTAL_FileUpload as FileUpload,
  Label,
  Link,
  Textarea,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { type ChangeEvent, useState } from 'react';
import { postToPlugin } from '../post-to-plugin';

const THEME_BUILDER_URL = 'https://theme.designsystemet.no';

type PasteViewProps = {
  value: string;
  onChange: (value: string) => void;
};

// The initial view: upload designsystemet.config.json, or paste it into the textarea.
// An uploaded file is read into the textarea, so it can be checked and edited before importing.
export function PasteView({
  value,
  onChange,
}: PasteViewProps): React.JSX.Element {
  const [upload, setUpload] = useState<
    { status: 'loaded'; fileName: string } | { status: 'error' } | null
  >(null);

  const readFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    try {
      onChange(await file.text());
      setUpload({ status: 'loaded', fileName: file.name });
    } catch {
      setUpload({ status: 'error' });
    }
    // Clear the input so choosing the same file again reads it again.
    input.value = '';
  };

  return (
    <div className='paste-view'>
      <Field>
        <Label>Upload config</Label>
        <Field.Description>
          Get your config from{' '}
          <Link
            href={THEME_BUILDER_URL}
            onClick={(event) => {
              // Links in the plugin UI can't open the browser, so the plugin opens it with figma.openExternal.
              event.preventDefault();
              postToPlugin('open-external', { url: THEME_BUILDER_URL });
            }}
          >
            theme.designsystemet.no
          </Link>
          , upload the file or paste it below, and click "Import".
        </Field.Description>
        <FileUpload data-color='neutral' className='paste-upload'>
          <Field.Description>
            {upload?.status === 'loaded'
              ? `Loaded ${upload.fileName}`
              : 'Drop designsystemet.config.json here'}
          </Field.Description>
          <Button asChild variant='secondary'>
            <span>Choose file</span>
          </Button>
          <input
            type='file'
            accept='.json,application/json'
            aria-invalid={upload?.status === 'error' || undefined}
            onChange={readFile}
          />
        </FileUpload>
        {upload?.status === 'error' && (
          <ValidationMessage>
            Could not read the file. Try again, or paste the config below.
          </ValidationMessage>
        )}
      </Field>
      <Field className='paste-field'>
        <Label>Or paste the config</Label>
        <Textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            // Once edited, the text no longer is just the uploaded file.
            setUpload(null);
          }}
        />
      </Field>
    </div>
  );
}
