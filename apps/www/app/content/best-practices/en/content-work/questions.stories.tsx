import {
  Details,
  Field,
  Input,
  Label,
  Textfield,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

export const WithRowsEn = () => {
  return (
    <Textfield
      label='What kind of issue did you experience? (This is a label)'
      description='Feel free to explain what you tried to do and what happened. (This is a description)'
      multiline
      rows={4}
    />
  );
};

export const WithExpandableDescriptionEn = () => {
  const [open, setOpen] = useState(true);

  return (
    <Field style={{ width: 'min(100%, 26rem)' }}>
      <Label>What is your national identity number?</Label>
      <Details
        open={open}
        onToggle={() => setOpen(!open)}
        style={{ background: 'transparent', borderBlockWidth: 0 }}
      >
        <Details.Summary
          style={{
            background: 'transparent',
            minHeight: 'auto',
            padding: 0,
          }}
        >
          Why do we ask for this?
        </Details.Summary>
        <Details.Content
          style={{ marginBlockStart: '0.5rem', marginInline: 0 }}
        >
          We use your national identity number to find the correct information
          about you and make sure the application is registered to the right
          person.
        </Details.Content>
      </Details>
      <Input inputMode='numeric' />
    </Field>
  );
};
