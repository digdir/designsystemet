import { Fieldset, Textfield } from '@digdir/designsystemet-react';

export const KnownDates = () => {
  return (
    <Fieldset>
      <Fieldset.Legend data-size='lg'>Når ble du født?</Fieldset.Legend>
      <Fieldset.Description>For eksempel 24 7 1987</Fieldset.Description>

      <div style={{ display: 'flex', gap: 'var(--ds-size-6)' }}>
        <Textfield
          label='Dag'
          style={{ maxWidth: '3.5em' }}
          autoComplete='bday-day'
        />
        <Textfield
          label='Måned'
          style={{ maxWidth: '3.5em' }}
          autoComplete='bday-month'
        />
        <Textfield
          label='År'
          style={{ maxWidth: '6.5em' }}
          autoComplete='bday-year'
        />
      </div>
    </Fieldset>
  );
};

export const NearFuturePast = () => {
  return (
    <Textfield
      label='Når skal fristen for innlevering være?'
      type='date'
      style={{ maxWidth: '14em' }}
    />
  );
};

export const StartEndDate = () => {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-size-6)' }}>
      <Textfield label='Startdato' type='date' />
      <Textfield label='Sluttdato' type='date' />
    </div>
  );
};

export const StartEndTime = () => {
  return (
    <Fieldset>
      <Fieldset.Legend data-size='lg'>
        Hvor lenge varer skoledagen?
      </Fieldset.Legend>
      <Fieldset.Description>Oppgi start- og sluttid</Fieldset.Description>
      <div style={{ display: 'flex', gap: 'var(--ds-size-6)' }}>
        <Textfield label='Fra kl' type='time' />
        <Textfield label='Til kl' type='time' />
      </div>
    </Fieldset>
  );
};
