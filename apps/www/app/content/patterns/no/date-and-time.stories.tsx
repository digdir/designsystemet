import {
  Field,
  Fieldset,
  Label,
  Radio,
  Select,
  Textfield,
} from '@digdir/designsystemet-react';

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
    <Fieldset>
      <Fieldset.Legend data-size='lg'>
        Hvor lenge skal du være borte?
      </Fieldset.Legend>
      <Fieldset.Description>Oppgi start- og sluttdato</Fieldset.Description>
      <div style={{ display: 'flex', gap: 'var(--ds-size-6)' }}>
        <Textfield label='Startdato' type='date' />
        <Textfield label='Sluttdato' type='date' />
      </div>
    </Fieldset>
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

export const ApproximateDate = () => {
  return (
    <Fieldset>
      <Fieldset.Legend data-size='lg'>Når skjedde hendelsen?</Fieldset.Legend>
      <Fieldset.Description>
        Oppgi omtrentlig tidspunkt. Vi kan ikke behandle saker lengre enn 20 år
        tilbake i tid.
      </Fieldset.Description>
      <div style={{ display: 'flex', gap: 'var(--ds-size-6)' }}>
        <Field>
          <Label>Måned</Label>
          <Select defaultValue='Januar'>
            <Select.Option value='januar'>Januar</Select.Option>
            <Select.Option value='februar'>Februar</Select.Option>
            <Select.Option value='mars'>Mars</Select.Option>
            <Select.Option value='april'>April</Select.Option>
            <Select.Option value='mai'>Mai</Select.Option>
            <Select.Option value='juni'>Juni</Select.Option>
            <Select.Option value='juli'>Juli</Select.Option>
            <Select.Option value='august'>August</Select.Option>
            <Select.Option value='september'>September</Select.Option>
            <Select.Option value='oktober'>Oktober</Select.Option>
            <Select.Option value='november'>November</Select.Option>
            <Select.Option value='desember'>Desember</Select.Option>
          </Select>
        </Field>
        <Field>
          <Label>År</Label>
          <Select defaultValue='2026'>
            <Select.Option value='2026'>2026</Select.Option>
            <Select.Option value='2025'>2025</Select.Option>
            <Select.Option value='2024'>2024</Select.Option>
            <Select.Option value='2023'>2023</Select.Option>
            <Select.Option value='2022'>2022</Select.Option>
            <Select.Option value='2021'>2021</Select.Option>
            <Select.Option value='2020'>2020</Select.Option>
            <Select.Option value='2019'>2019</Select.Option>
            <Select.Option value='2018'>2018</Select.Option>
            <Select.Option value='2017'>2017</Select.Option>
            <Select.Option value='2016'>2016</Select.Option>
            <Select.Option value='2015'>2015</Select.Option>
            <Select.Option value='2014'>2014</Select.Option>
            <Select.Option value='2013'>2013</Select.Option>
            <Select.Option value='2012'>2012</Select.Option>
            <Select.Option value='2011'>2011</Select.Option>
            <Select.Option value='2010'>2010</Select.Option>
            <Select.Option value='2009'>2009</Select.Option>
            <Select.Option value='2008'>2008</Select.Option>
            <Select.Option value='2007'>2007</Select.Option>
            <Select.Option value='2006'>2006</Select.Option>
          </Select>
        </Field>
      </div>
    </Fieldset>
  );
};

export const RelativeDate = () => {
  return (
    <Field>
      <Label>Når vil du ha påminnelse?</Label>
      <Select defaultValue='1 dag før'>
        <Select.Option value='15 minutter før'>15 minutter før</Select.Option>
        <Select.Option value='30 minutter før'>30 minutter før</Select.Option>
        <Select.Option value='1 time før'>1 time før</Select.Option>
        <Select.Option value='2 timer før'>2 timer før</Select.Option>
        <Select.Option value='1 dag før'>1 dag før</Select.Option>
        <Select.Option value='2 dager før'>2 dager før</Select.Option>
        <Select.Option value='3 dager før'>3 dager før</Select.Option>
        <Select.Option value='1 uke før'>1 uke før</Select.Option>
      </Select>
    </Field>
  );
};

export const PredefinedOptions1 = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Når vil du ha time?</Fieldset.Legend>
      <Fieldset.Description>
        Velg blant de neste fem ledige timene vi har, eller velg et senere
        tidspunkt.
      </Fieldset.Description>

      <Radio
        label='Tirsdag 17. feb kl. 10:00'
        value='2026-02-17T10:00'
        name='appointmentTime'
      />

      <Radio
        label='Tirsdag 17. feb kl. 14:00'
        value='2026-02-17T14:00'
        name='appointmentTime'
      />

      <Radio
        label='Fredag 20. feb kl. 13:30'
        value='2026-02-20T13:30'
        name='appointmentTime'
      />

      <Radio
        label='Mandag 23. feb kl. 08:00'
        value='2026-02-23T08:00'
        name='appointmentTime'
      />

      <Radio
        label='Mandag 23. feb kl. 08:30'
        value='2026-02-23T08:30'
        name='appointmentTime'
      />

      <a href='...' style={{ display: 'flex', marginTop: 'var(--ds-size-6)' }}>
        Finn ledige timer lengre frem i tid
      </a>
    </Fieldset>
  );
};
