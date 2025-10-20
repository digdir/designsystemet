import {
  Checkbox,
  Fieldset,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => (
  <Checkbox label='Checkbox label' description='Description' value='value' />
);

export const Group = () => {
  const [value, setValue] = useState<string[]>(['epost']);

  return (
    <Fieldset>
      <Fieldset.Legend>
        Hvordan vil du helst at vi skal kontakte deg?
      </Fieldset.Legend>
      <Fieldset.Description>
        Velg alle alternativene som er relevante for deg.
      </Fieldset.Description>
      <Checkbox
        label='E-post'
        value='epost'
        checked={value.includes('epost')}
        onChange={(e) => {
          if (e.target.checked) {
            setValue([...value, 'epost']);
          } else {
            setValue(value.filter((v) => v !== 'epost'));
          }
        }}
      />
      <Checkbox
        label='Telefon'
        value='telefon'
        checked={value.includes('telefon')}
        onChange={(e) => {
          if (e.target.checked) {
            setValue([...value, 'telefon']);
          } else {
            setValue(value.filter((v) => v !== 'telefon'));
          }
        }}
      />
      <Checkbox
        label='SMS'
        value='sms'
        checked={value.includes('sms')}
        onChange={(e) => {
          if (e.target.checked) {
            setValue([...value, 'sms']);
          } else {
            setValue(value.filter((v) => v !== 'sms'));
          }
        }}
      />
    </Fieldset>
  );
};

export const WithError = () => {
  const [value, setValue] = useState<string[]>([]);
  const error =
    value.length < 2 ? 'Du må velge minst to kontaktalternativ' : '';

  return (
    <Fieldset>
      <Fieldset.Legend>
        Hvordan vil du helst at vi skal kontakte deg?
      </Fieldset.Legend>
      <Fieldset.Description>
        Velg alle alternativene som er relevante for deg.
      </Fieldset.Description>
      <Checkbox
        label='E-post'
        value='epost'
        checked={value.includes('epost')}
        onChange={(e) => {
          if (e.target.checked) {
            setValue([...value, 'epost']);
          } else {
            setValue(value.filter((v) => v !== 'epost'));
          }
        }}
      />
      <Checkbox
        label='Telefon'
        value='telefon'
        checked={value.includes('telefon')}
        onChange={(e) => {
          if (e.target.checked) {
            setValue([...value, 'telefon']);
          } else {
            setValue(value.filter((v) => v !== 'telefon'));
          }
        }}
      />
      <Checkbox
        label='SMS'
        value='sms'
        checked={value.includes('sms')}
        onChange={(e) => {
          if (e.target.checked) {
            setValue([...value, 'sms']);
          } else {
            setValue(value.filter((v) => v !== 'sms'));
          }
        }}
      />
      {error && <ValidationMessage>{error}</ValidationMessage>}
    </Fieldset>
  );
};

export const Disabled = () => (
  <Checkbox label='Checkbox label' value='value' disabled />
);

export const ReadOnly = () => (
  <Checkbox label='Checkbox label' value='value' readOnly checked />
);
