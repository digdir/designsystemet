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
// Configs and theme CSS are far smaller (designsystemet.css is about 50 KB). Anything larger is refused,
// as reading and importing it could make Figma stop responding.
const MAX_SIZE = 1_000_000;
const MAX_SIZE_LABEL = '1 MB';

type ImportViewProps = {
  value: string;
  onChange: (value: string) => void;
};

// Where the config in the textarea came from, when it wasn't typed or pasted as JSON.
type Source =
  | { status: 'converting'; fileNames: string[] }
  | {
      status: 'loaded';
      /** Empty for pasted CSS. */
      fileNames: string[];
      /** Set when the config was created from theme CSS: what to check before importing. */
      warnings: string[];
    }
  | { status: 'error'; message: string }
  | null;

// The initial view: upload designsystemet.config.json, or theme CSS files built from a config (one per theme),
// or paste either into the textarea. Theme CSS isn't mentioned in the UI yet, as it's a hidden feature for now.
// Uploaded files and pasted CSS end up as a JSON config in the textarea, so it can be checked
// and edited before importing.
export function ImportView({
  value,
  onChange,
}: ImportViewProps): React.JSX.Element {
  const [source, setSource] = useState<Source>(null);

  const load = async (files: { text: string; fileName?: string }[]) => {
    const fileNames = files.flatMap(({ fileName }) =>
      fileName ? [fileName] : [],
    );
    const cssFiles = files.filter(({ text, fileName }) =>
      isThemeCss(text, fileName),
    );

    if (cssFiles.length === 0 && files.length === 1) {
      onChange(files[0].text);
      setSource({ status: 'loaded', fileNames, warnings: [] });
      return;
    }
    // Several files are only read as theme CSS, one file per theme.
    if (cssFiles.length !== files.length) {
      setSource({
        status: 'error',
        message: 'Upload one config file at a time.',
      });
      return;
    }

    setSource({ status: 'converting', fileNames });
    const result = await convertCss(
      cssFiles.map(({ text, fileName }) => ({ css: text, fileName })),
    );
    if (result.status === 'success' && result.config) {
      onChange(result.config);
      setSource({
        status: 'loaded',
        fileNames,
        warnings: result.warnings ?? [],
      });
    } else {
      setSource({
        status: 'error',
        message: `Could not create a config from ${describeFiles(fileNames)}: ${result.message ?? 'Unknown error'}`,
      });
    }
  };

  const readFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;
    const tooLarge = files.find((file) => file.size > MAX_SIZE);
    if (tooLarge) {
      setSource({
        status: 'error',
        message: `${tooLarge.name} is larger than ${MAX_SIZE_LABEL}, which is too big for a config.`,
      });
      input.value = '';
      return;
    }
    try {
      await load(
        await Promise.all(
          files.map(async (file) => ({
            text: await file.text(),
            fileName: file.name,
          })),
        ),
      );
    } catch {
      setSource({
        status: 'error',
        message:
          'Could not read the file. Try again, or paste the config below.',
      });
    }
    // Clear the input so choosing the same files again reads them again.
    input.value = '';
  };

  // Pasted CSS is turned into a config. A pasted JSON config goes into the textarea as usual, unless it's too large.
  const pasteCss = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const text = event.clipboardData.getData('text');
    if (text.length > MAX_SIZE) {
      event.preventDefault();
      setSource({
        status: 'error',
        message: `The pasted text is larger than ${MAX_SIZE_LABEL}, which is too big for a config.`,
      });
      return;
    }
    if (isThemeCss(text)) {
      event.preventDefault();
      void load([{ text }]);
    }
  };

  return (
    <div className='import-view'>
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
        <FileUpload data-color='neutral' className='import-upload'>
          <Field.Description>
            {source?.status === 'converting' && source.fileNames.length > 0
              ? `Reading ${source.fileNames.join(', ')}…`
              : source?.status === 'loaded' && source.fileNames.length > 0
                ? `Loaded ${source.fileNames.join(', ')}`
                : 'Drop designsystemet.config.json here'}
          </Field.Description>
          <Button asChild variant='secondary'>
            <span>Choose file</span>
          </Button>
          <input
            type='file'
            accept='.json,.css,application/json,text/css'
            // Several theme CSS files make one config, a theme per file.
            multiple
            aria-invalid={source?.status === 'error' || undefined}
            onChange={readFiles}
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
      <Field className='import-field'>
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

/** Names the files in a message, or the pasted CSS when there are none. */
function describeFiles(fileNames: string[]): string {
  return fileNames.length === 0
    ? 'the pasted CSS'
    : fileNames.length === 1
      ? fileNames[0]
      : `${fileNames.length} files`;
}
