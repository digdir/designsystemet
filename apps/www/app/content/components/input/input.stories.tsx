import {
  Divider,
  Field,
  Fieldset,
  Input,
  Label,
} from '@digdir/designsystemet-react';

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

export const WithLabelEn = () => {
  return (
    <Field>
      <Label>Social Security Number</Label>
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

export const WithErrorEn = () => {
  return (
    <Field>
      <Label>Social Security Number</Label>
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

export const DisabledEn = () => {
  return (
    <Field>
      <Label>Social Security Number</Label>
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

export const ReadOnlyEn = () => {
  return (
    <Field>
      <Label>Social Security Number</Label>
      <Input readOnly value='12345678901' />
    </Field>
  );
};

export const ReadOnlyCheckAndRadio = () => {
  return (
    <>
      <Fieldset>
        <Fieldset.Legend>Kjønn</Fieldset.Legend>
        <Field>
          <Input
            readOnly
            value='male'
            name='gender'
            type='radio'
            defaultChecked
          />
          <Label>Mann</Label>
        </Field>
        <Field>
          <Input readOnly value='female' name='gender' type='radio' />
          <Label>Kvinne</Label>
        </Field>
        <Field>
          <Input readOnly value='other' name='gender' type='radio' />
          <Label>Annet</Label>
        </Field>
      </Fieldset>
      <Divider />
      <Field>
        <Input readOnly type='checkbox' defaultChecked name='checkbox' />
        <Label>Jeg samtykker</Label>
      </Field>
    </>
  );
};

export const ReadOnlyCheckAndRadioEn = () => {
  return (
    <>
      <Fieldset>
        <Fieldset.Legend>Gender</Fieldset.Legend>
        <Field>
          <Input
            readOnly
            value='male'
            name='gender'
            type='radio'
            defaultChecked
          />
          <Label>Male</Label>
        </Field>
        <Field>
          <Input readOnly value='female' name='gender' type='radio' />
          <Label>Female</Label>
        </Field>
        <Field>
          <Input readOnly value='other' name='gender' type='radio' />
          <Label>Other</Label>
        </Field>
      </Fieldset>
      <Divider />
      <Field>
        <Input readOnly type='checkbox' defaultChecked name='checkbox' />
        <Label>I consent</Label>
      </Field>
    </>
  );
};
