import { Tag, Textfield, Field, Label, Select, type TextfieldProps } from '@digdir/designsystemet-react';
import { useState } from 'react';
import { ArrowRightIcon } from '@navikt/aksel-icons';

export const Preview = () => {
  return <Textfield label='Label' />;
};

export const WithRows = () => {
  return <Textfield label='Label' multiline rows={4} />;
};

export const WithAffix = () => {
  return (
    <Textfield
      prefix='NOK'
      suffix='pr. mnd'
      label='Hvor mange kroner koster det per måned?'
    />
  );
};

export const WithAffixEn = () => {
  return (
    <Textfield
      prefix='GBP'
      suffix='per month'
      label='How much does it cost per month?'
    />
  );
};

export const WithCounter = () => {
  return (
    <Textfield counter={10} label='Hvor mange kroner koster det per måned?' />
  );
};

export const WithCounterEn = () => {
  return (
    <Textfield counter={10} label='How many pounds does it cost per month?' />
  );
};

export const Required = () => (
  <Textfield
    label={
      <>
        Hvor bor du?
        <Tag
          data-color='warning'
          style={{ marginInlineStart: 'var(--ds-size-2)' }}
        >
          Må fylles ut
        </Tag>
      </>
    }
    required
  />
);

export const RequiredEn = () => (
  <Textfield
    label={
      <>
        Where do you live?
        <Tag
          data-color='warning'
          style={{ marginInlineStart: 'var(--ds-size-2)' }}
        >
          Required
        </Tag>
      </>
    }
    required
  />
);


export const InputType = () => {
  const [type, setType] = useState<TextfieldProps['type'] >('text');

  return (
    <div style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'end', flexWrap: 'wrap' }}>
      <Field>
        <Label><span data-lang='no'>Velg</span><span data-lang='en'>Choose</span> type</Label>
        <Select defaultValue='text' onChange={(e) => setType(e.target.value as TextfieldProps['type'])}>
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
      <ArrowRightIcon aria-hidden fontSize={48}/>
      <Textfield label={`type="${type}"`} type={type} />
    </div>
  );
};
