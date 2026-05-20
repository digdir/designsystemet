import {
  Details,
  Field,
  Input,
  Label,
  Textfield,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

export const WithRows = () => {
  return (
    <Textfield
      label='Hva slags utfordring opplevde du? (Dette er en ledetekst)'
      description='Forklar gjerne hva du prøvde å gjøre, og hva som skjedde. (Dette er en beskrivelse)'
      multiline
      rows={4}
    />
  );
};

export const WithExpandableDescription = () => {
  const [open, setOpen] = useState(true);

  return (
    <Field style={{ width: 'min(100%, 26rem)' }}>
      <Label>Hva er fødselsnummeret ditt?</Label>
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
          Hvorfor lurer vi på dette?
        </Details.Summary>
        <Details.Content
          style={{ marginBlockStart: '0.5rem', marginInline: 0 }}
        >
          Vi bruker fødselsnummeret til å finne riktige opplysninger om deg og
          sikre at søknaden blir registrert på riktig person.
        </Details.Content>
      </Details>
      <Input inputMode='numeric' />
    </Field>
  );
};
