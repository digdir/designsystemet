import {
  Divider,
  Field,
  Fieldset,
  Input,
  Label,
  Select,
  type TextfieldProps,
} from '@digdir/designsystemet-react';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

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

export const InputType = () => {
  const [type, setType] = useState<TextfieldProps['type']>('text');

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-size-4)',
        alignItems: 'end',
        flexWrap: 'wrap',
      }}
    >
      <Field>
        <Label>
          <span data-lang='no'>Velg</span>
          <span data-lang='en'>Choose</span> type
        </Label>
        <Select
          defaultValue='text'
          lang='en'
          onChange={(e) => setType(e.target.value as TextfieldProps['type'])}
        >
          <Select.Option value='text'>text</Select.Option>
          <Select.Option value='color'>color</Select.Option>
          <Select.Option value='date'>date</Select.Option>
          <Select.Option value='datetime-local'>datetime-local</Select.Option>
          <Select.Option value='email'>email</Select.Option>
          <Select.Option value='file'>file</Select.Option>
          <Select.Option value='month'>month</Select.Option>
          <Select.Option value='hidden'>hidden</Select.Option>
          <Select.Option value='number'>number</Select.Option>
          <Select.Option value='password'>password</Select.Option>
          <Select.Option value='search'>search</Select.Option>
          <Select.Option value='tel'>tel</Select.Option>
          <Select.Option value='time'>time</Select.Option>
          <Select.Option value='url'>url</Select.Option>
          <Select.Option value='week'>week</Select.Option>
        </Select>
      </Field>
      <ArrowRightIcon aria-hidden width='3rem' height='3rem' />
      <Field>
        <Label>{`type="${type}"`}</Label>
        <Input type={type} />
      </Field>
    </div>
  );
};
