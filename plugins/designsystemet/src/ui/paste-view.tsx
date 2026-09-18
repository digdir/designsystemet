import { Field, Label, Textarea } from '@digdir/designsystemet-react';

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
      <Field>
        <Label>Upload config</Label>
        <Field.Description>
          Paste your designsystemet.config.json content below and click preview.
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
