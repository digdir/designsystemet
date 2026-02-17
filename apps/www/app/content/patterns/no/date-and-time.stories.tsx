import { Fieldset, Textfield } from '@digdir/designsystemet-react';

export const KnownDates = () => {
  return (
    <Fieldset>
      <Fieldset.Legend data-size='lg'>Når ble du født?</Fieldset.Legend>
      <Fieldset.Description>For eksempel 24 7 1987</Fieldset.Description>

      <div style={{ display: 'flex', gap: 'var(--ds-size-4)' }}>
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
