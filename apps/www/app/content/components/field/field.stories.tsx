import {
  Field,
  Input,
  Label,
  Textarea,
  ValidationMessage,
} from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <Field>
      <Label>Etternavn</Label>
      <Field.Description>
        Etternavn kan ikke inneholde mellomrom
      </Field.Description>
      <Input defaultValue='Nordmann Svenske' />
      <ValidationMessage>
        Du kan ikke ha mellomrom i etternavnet ditt
      </ValidationMessage>
    </Field>
  );
};

export const Affix = () => (
  <Field>
    <Label>Hvor mange kroner koster det per måned?</Label>
    <Field.Affixes>
      <Field.Affix>NOK</Field.Affix>
      <Input />
      <Field.Affix>pr. mnd.</Field.Affix>
    </Field.Affixes>
  </Field>
);

export const Counter = () => (
  <Field>
    <Label>Legg til en beskrivelse</Label>
    <Textarea rows={2} />
    <Field.Counter limit={10} />
  </Field>
);

export const Position = () => (
  <>
    <Field position='end'>
      <Label>Flymodus</Label>
      <Input type='checkbox' role='switch' />
    </Field>
    <Field position='end'>
      <Label>Lydløs</Label>
      <Input type='checkbox' role='switch' />
    </Field>
  </>
);
