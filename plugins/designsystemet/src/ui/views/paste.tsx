import { Field, Label, Link, Textarea } from '@digdir/designsystemet-react';
import { postToPlugin } from '../post-to-plugin';

const THEME_BUILDER_URL = 'https://theme.designsystemet.no';

type PasteViewProps = {
  value: string;
  onChange: (value: string) => void;
};

// The initial view: a textarea where the user pastes their designsystemet.config.json.
export function PasteView({
  value,
  onChange,
}: PasteViewProps): React.JSX.Element {
  return (
    <div className='paste-view'>
      <Field className='paste-field'>
        <Label>Upload config</Label>
        <Field.Description>
          Paste your config from{' '}
          <Link
            href={THEME_BUILDER_URL}
            onClick={(event) => {
              // Links in the plugin UI can't open the browser, so the plugin opens it with figma.openExternal.
              event.preventDefault();
              postToPlugin('open-external', { url: THEME_BUILDER_URL });
            }}
          >
            theme.designsystemet.no
          </Link>{' '}
          below and click "Sync to Figma".
        </Field.Description>
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
      </Field>
    </div>
  );
}
