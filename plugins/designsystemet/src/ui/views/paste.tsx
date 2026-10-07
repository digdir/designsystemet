import {
  Alert,
  Button,
  Field,
  EXPERIMENTAL_FileUpload as FileUpload,
  Label,
  Link,
  Textarea,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { type ChangeEvent, type ClipboardEvent, useState } from 'react';
import { convertCss, isThemeCss } from '../convert-css';
import { postToPlugin } from '../post-to-plugin';

const THEME_BUILDER_URL = 'https://theme.designsystemet.no';

type PasteViewProps = {
  value: string;
  onChange: (value: string) => void;
};

// Where the config in the textarea came from, when it wasn't typed or pasted as JSON.
type Source =
  | { status: 'converting'; fileName?: string }
  | {
      status: 'loaded';
      fileName?: string;
      /** Set when the config was created from theme CSS: what to check before importing. */
      warnings: string[];
    }
  | { status: 'error'; message: string }
  | null;

// The initial view: upload designsystemet.config.json or theme CSS built from a config, or paste either into
// the textarea. Theme CSS isn't mentioned in the UI yet, as it's a hidden feature for now.
// Uploaded files and pasted CSS end up as a JSON config in the textarea, so it can be checked
// and edited before importing.
export function PasteView({
  value,
  onChange,
}: PasteViewProps): React.JSX.Element {
  const [source, setSource] = useState<Source>(null);

  const load = async (text: string, fileName?: string) => {
    if (!isThemeCss(text, fileName)) {
      onChange(text);
      setSource({ status: 'loaded', fileName, warnings: [] });
      return;
    }

    setSource({ status: 'converting', fileName });
    const result = await convertCss(text, fileName);
    if (result.status === 'success' && result.config) {
      onChange(result.config);
      setSource({
        status: 'loaded',
        fileName,
        warnings: result.warnings ?? [],
      });
    } else {
      setSource({
        status: 'error',
        message: `Could not create a config from ${fileName ?? 'the pasted CSS'}: ${result.message ?? 'Unknown error'}`,
      });
    }
  };

  const readFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    try {
      await load(await file.text(), file.name);
    } catch {
      setSource({
        status: 'error',
        message:
          'Could not read the file. Try again, or paste the config below.',
      });
    }
    // Clear the input so choosing the same file again reads it again.
    input.value = '';
  };

  // Pasted CSS is turned into a config. A pasted JSON config goes into the textarea as usual.
  const pasteCss = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const text = event.clipboardData.getData('text');
    if (isThemeCss(text)) {
      event.preventDefault();
      void load(text);
    }
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
            {source?.status === 'converting' && source.fileName
              ? `Reading ${source.fileName}…`
              : source?.status === 'loaded' && source.fileName
                ? `Loaded ${source.fileName}`
                : 'Drop designsystemet.config.json here'}
          </Field.Description>
          <Button asChild variant='secondary'>
            <span>Choose file</span>
          </Button>
          <input
            type='file'
            accept='.json,.css,application/json,text/css'
            aria-invalid={source?.status === 'error' || undefined}
            onChange={readFile}
          />
        </FileUpload>
        {source?.status === 'error' && (
          <ValidationMessage>{source.message}</ValidationMessage>
        )}
      </Field>
      {source?.status === 'loaded' && source.warnings.length > 0 && (
        <Alert data-color='warning'>
          Created a config from the CSS. Check it before importing:
          <ul className='notification-details'>
            {source.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}
      <Field className='paste-field'>
        <Label>Or paste the config</Label>
        <Textarea
          value={value}
          onPaste={pasteCss}
          onChange={(e) => {
            onChange(e.target.value);
            // Once edited, the text is no longer just what was loaded.
            setSource(null);
          }}
        />
      </Field>
    </div>
  );
}
