import {
  Checkbox,
  Fieldset,
  useCheckboxGroup,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';

export const Preview = () => {
  return (
    <Checkbox label='Checkbox label' description='Description' value='value' />
  );
};

export const OneOption = () => (
  <Fieldset>
    <Fieldset.Legend>Bekreft at du er over 18 år</Fieldset.Legend>
    <Fieldset.Description>
      For at vi skal kunne sende deg opplysningen du ber om, må du bekrefte at
      du er myndig.
    </Fieldset.Description>
    <Checkbox label='Jeg bekrefter at jeg er over 18 år' value='samtykke' />
  </Fieldset>
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
  const [error, setError] = useState('');
  const { getCheckboxProps, validationMessageProps, value } = useCheckboxGroup({
    value: ['epost'],
    error,
  });

  useEffect(() => {
    if (value.length < 2) {
      setError('Du må velge minst to alternativ');
    } else {
      setError('');
    }
  }, [value]);

  return (
    <Fieldset>
      <Fieldset.Legend>
        Hvordan vil du helst at vi skal kontakte deg?
      </Fieldset.Legend>
      <Fieldset.Description>
        Velg alle alternativene som er relevante for deg.
      </Fieldset.Description>
      <Checkbox label='E-post' {...getCheckboxProps('epost')} />
      <Checkbox label='Telefon' {...getCheckboxProps('telefon')} />
      <Checkbox label='SMS' {...getCheckboxProps('sms')} />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};

export const Disabled = () => {
  const { getCheckboxProps, validationMessageProps } = useCheckboxGroup({
    value: ['epost'],
    disabled: true,
  });

  return (
    <Fieldset>
      <Fieldset.Legend>
        Hvordan vil du helst at vi skal kontakte deg?
      </Fieldset.Legend>
      <Fieldset.Description>
        Velg alle alternativene som er relevante for deg.
      </Fieldset.Description>
      <Checkbox label='E-post' {...getCheckboxProps('epost')} />
      <Checkbox label='Telefon' {...getCheckboxProps('telefon')} />
      <Checkbox label='SMS' {...getCheckboxProps('sms')} />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};

export const ReadOnly = () => {
  const { getCheckboxProps, validationMessageProps } = useCheckboxGroup({
    value: ['epost'],
    readOnly: true,
  });

  return (
    <Fieldset>
      <Fieldset.Legend>
        Hvordan vil du helst at vi skal kontakte deg?
      </Fieldset.Legend>
      <Fieldset.Description>
        Velg alle alternativene som er relevante for deg.
      </Fieldset.Description>
      <Checkbox label='E-post' {...getCheckboxProps('epost')} />
      <Checkbox label='Telefon' {...getCheckboxProps('telefon')} />
      <Checkbox label='SMS' {...getCheckboxProps('sms')} />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};
