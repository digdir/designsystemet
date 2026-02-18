import {
  Field,
  Fieldset,
  Label,
  Link,
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
          inputMode='numeric'
          pattern='[0-9]*'
          maxLength={2}
        />
        <Textfield
          label='Måned'
          style={{ maxWidth: '3.5em' }}
          autoComplete='bday-month'
          inputMode='numeric'
          pattern='[0-9]*'
          maxLength={2}
        />
        <Textfield
          label='År'
          style={{ maxWidth: '6.5em' }}
          autoComplete='bday-year'
          inputMode='numeric'
          pattern='[0-9]*'
          maxLength={4}
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

      <Link
        href='#la-brukeren-begrense-utvalget'
        style={{ display: 'flex', marginTop: 'var(--ds-size-6)' }}
      >
        Finn ledige timer lengre frem i tid
      </Link>
    </Fieldset>
  );
};

export const PredefinedOptions2 = () => {
  return (
    <Fieldset>
      <Fieldset.Legend data-size='lg'>Når vil du ha time?</Fieldset.Legend>
      <Fieldset.Description>
        Dersom noen uker ikke er tilgjengelige å velge, betyr det at det ikke
        finnes ledige tidspunkt i den uken. Foretrekker du tirsdager, kan du
        velge en bestemt ukedag i stedet for uke. Da vises alle ledige tidspunkt
        på tirsdager fremover.
      </Fieldset.Description>

      <div
        style={{ display: 'flex', gap: 'var(--ds-size-6)', flexWrap: 'wrap' }}
      >
        <Field>
          <Label>Velg foretrukket uke</Label>
          <Select defaultValue=''>
            <Select.Option value='' disabled>
              Velg en uke …
            </Select.Option>
            <Select.Option value='uke10'>
              Uke 10 (2.mars - 8.mars)
            </Select.Option>
            <Select.Option value='uke11'>
              Uke 11 (9.mars - 15.mars)
            </Select.Option>
            <Select.Option value='uke12'>
              Uke 12 (16.mars - 22.mars)
            </Select.Option>
            <Select.Option value='uke14'>
              Uke 14 (30.mars - 5.april)
            </Select.Option>
            <Select.Option value='uke15'>
              Uke 15 (6.april - 12.april)
            </Select.Option>
            <Select.Option value='uke16'>
              Uke 16 (13.april - 19.april)
            </Select.Option>
          </Select>
        </Field>

        <Field>
          <Label>Velg foretrukket dag</Label>
          <Select defaultValue='Tirsdag'>
            <Select.Option value='' disabled>
              Velg en dag …
            </Select.Option>
            <Select.Option value='Mandag'>Mandag</Select.Option>
            <Select.Option value='Tirsdag'>Tirsdag</Select.Option>
            <Select.Option value='Onsdag'>Onsdag</Select.Option>
            <Select.Option value='Torsdag'>Torsdag</Select.Option>
            <Select.Option value='Fredag'>Fredag</Select.Option>
          </Select>
        </Field>

        <Field>
          <Label>Velg foretrukket klokkeslett</Label>
          <Select defaultValue=''>
            <Select.Option value='' disabled>
              Velg et klokkeslett …
            </Select.Option>
            <Select.Option value='08-11'>Mellom 08:00 og 11:00</Select.Option>
            <Select.Option value='11-14'>Mellom 11:00 og 14:00</Select.Option>
            <Select.Option value='14-17'>Mellom 14:00 og 17:00</Select.Option>
            <Select.Option value='17-20'>Mellom 17:00 og 20:00</Select.Option>
          </Select>
        </Field>
      </div>

      <Fieldset style={{ marginTop: 'var(--ds-size-6)' }}>
        <Fieldset.Legend>Velg et av de ledige tidspunktene</Fieldset.Legend>

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
          label='Tirsdag 24. feb kl. 08:00'
          value='2026-02-24T08:00'
          name='appointmentTime'
        />

        <Radio
          label='Tirsdag 24. feb kl. 09:30'
          value='2026-02-24T09:30'
          name='appointmentTime'
        />

        <Radio
          label='Tirsdag 3. mars kl. 12:30'
          value='2026-03-03T12:30'
          name='appointmentTime'
        />
      </Fieldset>
    </Fieldset>
  );
};
