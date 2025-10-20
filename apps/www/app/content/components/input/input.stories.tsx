import { Field, Input, Label } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Input aria-label='input' />;
};

export const WithLabel = () => {
  return (
    <Field>
      <Label>Fødselsnummer</Label>
      <Input />
    </Field>
  );
};

export const WithError = () => {
  return (
    <Field>
      <Label>Fødselsnummer</Label>
      <Input aria-invalid />
    </Field>
  );
};

export const Disabled = () => {
  return (
    <Field>
      <Label>Fødselsnummer</Label>
      <Input disabled value='12345678901' />
    </Field>
  );
};

export const ReadOnly = () => {
  return (
    <Field>
      <Label>Fødselsnummer</Label>
      <Input readOnly value='12345678901' />
    </Field>
  );
};
