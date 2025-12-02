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

export const PreviewEn = () => {
  return (
    <Field>
      <Label>Last name</Label>
      <Field.Description>Last name cannot contain spaces</Field.Description>
      <Input defaultValue='Smith Washington' />
      <ValidationMessage>
        You cannot have spaces in your last name
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

export const AffixEn = () => (
  <Field>
    <Label>How many pounds does it cost per month?</Label>
    <Field.Affixes>
      <Field.Affix>GBP</Field.Affix>
      <Input />
      <Field.Affix>per month</Field.Affix>
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

export const CounterEn = () => (
  <Field>
    <Label>Add a description</Label>
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
  </>
);

export const PositionEn = () => (
  <>
    <Field position='end'>
      <Label>Airplane mode</Label>
      <Input type='checkbox' role='switch' />
    </Field>
  </>
);
