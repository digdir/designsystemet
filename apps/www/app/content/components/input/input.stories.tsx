import { Field, Input, Label } from '@digdir/designsystemet-react';

export const Preview = () => <Input aria-label='input' />;

export const WithLabel = () => (
  <Field>
    <Label>Fødselsnummer</Label>
    <Input />
  </Field>
);

export const WithError = () => (
  <Field>
    <Label>Fødselsnummer</Label>
    <Input aria-invalid />
  </Field>
);

export const Disabled = () => (
  <Field>
    <Label>Fødselsnummer</Label>
    <Input disabled value='12345678901' />
  </Field>
);

export const ReadOnly = () => (
  <Field>
    <Label>Fødselsnummer</Label>
    <Input readOnly value='12345678901' />
  </Field>
);
