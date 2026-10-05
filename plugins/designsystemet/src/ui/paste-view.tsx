import {
  Details,
  DetailsContent,
  DetailsSummary,
  Field,
  Label,
  Link,
  List,
  Paragraph,
  Textarea,
} from '@digdir/designsystemet-react';
import { postToPlugin } from './post-to-plugin';

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
      {/* Outside the field so the textarea's description stays short for screen readers. */}
      <Details data-size='sm' className='sync-details'>
        <DetailsSummary>What does syncing do?</DetailsSummary>
        <DetailsContent>
          <Paragraph>Syncing makes this file match the config:</Paragraph>
          <List.Unordered>
            <List.Item>
              Creates the variable collections, modes, variables, text styles
              and effect styles in the config.
            </List.Item>
            <List.Item>
              Updates the ones that already exist, matched by name, so layers
              using them stay connected.
            </List.Item>
            <List.Item>
              Deletes modes and variables in those collections that aren't in
              the config, including ones added by hand. The same goes for text
              styles under typography/ and effect styles under shadow/.
            </List.Item>
            <List.Item>Leaves other collections and styles alone.</List.Item>
          </List.Unordered>
        </DetailsContent>
      </Details>
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
          below and click Sync to Figma.
        </Field.Description>
        <Textarea
          id='config-textarea'
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>
    </div>
  );
}
