import { Field, Input, Label, Textfield } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Label>Fødselsnummer (11 sifre)</Label>;
};

export const PreviewEn = () => {
  return <Label>National identity number (11 digits)</Label>;
};

export const Weights = () => {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-size-8)' }}>
      <Field>
        <Label>Label for text input</Label>
        <Input type='text' />
      </Field>
      <Field>
        <Label>Label for checkbox input</Label>
        <Input type='checkbox' />
      </Field>
    </div>
  );
};

export const TextFieldLabel = () => {
  return (
    <Textfield label='Gateadresse' description='Eksempel: Solsikkeveien 44' />
  );
};

export const TextFieldLabelEn = () => {
  return (
    <Textfield
      label='Street address'
      description='Example: Sunflower Road 44'
    />
  );
};
