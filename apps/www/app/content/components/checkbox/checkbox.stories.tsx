import {
  Checkbox,
  Fieldset,
  Table,
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

export const GroupEn = () => {
  const [value, setValue] = useState<string[]>(['epost']);

  return (
    <Fieldset>
      <Fieldset.Legend>How would you prefer us to contact you?</Fieldset.Legend>
      <Fieldset.Description>
        Select all the options that are relevant to you.
      </Fieldset.Description>
      <Checkbox
        label='E-mail'
        value='email'
        checked={value.includes('email')}
        onChange={(e) => {
          if (e.target.checked) {
            setValue([...value, 'email']);
          } else {
            setValue(value.filter((v) => v !== 'email'));
          }
        }}
      />
      <Checkbox
        label='Phone'
        value='phone'
        checked={value.includes('phone')}
        onChange={(e) => {
          if (e.target.checked) {
            setValue([...value, 'phone']);
          } else {
            setValue(value.filter((v) => v !== 'phone'));
          }
        }}
      />
      <Checkbox
        label='Text message'
        value='text'
        checked={value.includes('text')}
        onChange={(e) => {
          if (e.target.checked) {
            setValue([...value, 'text']);
          } else {
            setValue(value.filter((v) => v !== 'text'));
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

export const InTable = () => {
  const tableData = [
    {
      id: 1,
      navn: 'Lise Nordmann',
      epost: 'lise@nordmann.no',
      telefon: '68051156',
    },
    {
      id: 2,
      navn: 'Kari Nordmann',
      epost: 'kari@nordmann.no',
      telefon: '68059679',
    },
    {
      id: 3,
      navn: 'Ola Nordmann',
      epost: 'ola@nordmann.no',
      telefon: '68055731',
    },
    {
      id: 4,
      navn: 'Per Nordmann',
      epost: 'per@nordmann.no',
      telefon: '68059631',
    },
  ];

  const { getCheckboxProps } = useCheckboxGroup({
    name: 'checkbox-table',
    value: ['2', '3'],
  });

  return (
    <Table>
      <colgroup>
        {/* ensure the first column only takes up the necessary space */}
        <col style={{ width: '1px' }} />
        <col />
        <col />
      </colgroup>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>
            <Checkbox
              aria-label='Velg alle'
              {...getCheckboxProps({
                allowIndeterminate: true,
                value: 'all',
              })}
            />
          </Table.HeaderCell>
          <Table.HeaderCell>Navn</Table.HeaderCell>
          <Table.HeaderCell>E-post</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {tableData.map((person) => (
          <Table.Row key={person.id}>
            <Table.Cell>
              <Checkbox
                aria-labelledby={`checkbox-${person.id}-name`}
                {...getCheckboxProps(person.id.toString())}
              />
            </Table.Cell>
            <Table.Cell id={`checkbox-${person.id}-name`}>
              {person.navn}
            </Table.Cell>
            <Table.Cell>{person.epost}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
export const InTableEn = () => {
  const tableData = [
    {
      id: 1,
      navn: 'Lise Nordmann',
      epost: 'lise@nordmann.no',
      telefon: '68051156',
    },
    {
      id: 2,
      navn: 'Kari Nordmann',
      epost: 'kari@nordmann.no',
      telefon: '68059679',
    },
    {
      id: 3,
      navn: 'Ola Nordmann',
      epost: 'ola@nordmann.no',
      telefon: '68055731',
    },
    {
      id: 4,
      navn: 'Per Nordmann',
      epost: 'per@nordmann.no',
      telefon: '68059631',
    },
  ];

  const { getCheckboxProps } = useCheckboxGroup({
    name: 'checkbox-table',
    value: ['2', '3'],
  });

  return (
    <Table>
      <colgroup>
        {/* ensure the first column only takes up the necessary space */}
        <col style={{ width: '1px' }} />
        <col />
        <col />
      </colgroup>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>
            <Checkbox
              aria-label='Select all'
              {...getCheckboxProps({
                allowIndeterminate: true,
                value: 'all',
              })}
            />
          </Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>E-mail</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {tableData.map((person) => (
          <Table.Row key={person.id}>
            <Table.Cell>
              <Checkbox
                aria-labelledby={`checkbox-${person.id}-name`}
                {...getCheckboxProps(person.id.toString())}
              />
            </Table.Cell>
            <Table.Cell id={`checkbox-${person.id}-name`}>
              {person.navn}
            </Table.Cell>
            <Table.Cell>{person.epost}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
