import {
  Field,
  Fieldset,
  Label,
  Radio,
  Select,
  Textfield,
} from '@digdir/designsystemet-react';

export const KnownDatesEN = () => {
  return (
    <Fieldset>
      <Fieldset.Legend data-size='lg'>When were you born?</Fieldset.Legend>
      <Fieldset.Description>For example 24 7 1987</Fieldset.Description>

      <div style={{ display: 'flex', gap: 'var(--ds-size-6)' }}>
        <Textfield
          label='Day'
          style={{ maxWidth: '3.5em' }}
          autoComplete='bday-day'
        />
        <Textfield
          label='Month'
          style={{ maxWidth: '3.5em' }}
          autoComplete='bday-month'
        />
        <Textfield
          label='Year'
          style={{ maxWidth: '6.5em' }}
          autoComplete='bday-year'
        />
      </div>
    </Fieldset>
  );
};

export const NearFuturePastEN = () => {
  return (
    <Textfield
      label='When should the submission deadline be?'
      type='date'
      style={{ maxWidth: '14em' }}
    />
  );
};

export const StartEndDateEN = () => {
  return (
    <Fieldset>
      <Fieldset.Legend data-size='lg'>
        How long will you be away?
      </Fieldset.Legend>
      <Fieldset.Description>Enter start and end date</Fieldset.Description>
      <div style={{ display: 'flex', gap: 'var(--ds-size-6)' }}>
        <Textfield label='Start date' type='date' />
        <Textfield label='End date' type='date' />
      </div>
    </Fieldset>
  );
};

export const StartEndTimeEN = () => {
  return (
    <Fieldset>
      <Fieldset.Legend data-size='lg'>
        How long does the school day last?
      </Fieldset.Legend>
      <Fieldset.Description>Enter start and end time</Fieldset.Description>
      <div style={{ display: 'flex', gap: 'var(--ds-size-6)' }}>
        <Textfield label='From' type='time' />
        <Textfield label='To' type='time' />
      </div>
    </Fieldset>
  );
};

export const ApproximateDateEN = () => {
  return (
    <Fieldset>
      <Fieldset.Legend data-size='lg'>
        When did the event occur?
      </Fieldset.Legend>
      <Fieldset.Description>
        Enter an approximate date. We cannot process cases more than 20 years
        back.
      </Fieldset.Description>
      <div style={{ display: 'flex', gap: 'var(--ds-size-6)' }}>
        <Field>
          <Label>Month</Label>
          <Select defaultValue='January'>
            <Select.Option value='january'>January</Select.Option>
            <Select.Option value='february'>February</Select.Option>
            <Select.Option value='march'>March</Select.Option>
            <Select.Option value='april'>April</Select.Option>
            <Select.Option value='may'>May</Select.Option>
            <Select.Option value='june'>June</Select.Option>
            <Select.Option value='july'>July</Select.Option>
            <Select.Option value='august'>August</Select.Option>
            <Select.Option value='september'>September</Select.Option>
            <Select.Option value='october'>October</Select.Option>
            <Select.Option value='november'>November</Select.Option>
            <Select.Option value='december'>December</Select.Option>
          </Select>
        </Field>
        <Field>
          <Label>Year</Label>
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

export const RelativeDateEN = () => {
  return (
    <Field>
      <Label>When would you like a reminder?</Label>
      <Select defaultValue='1 day before'>
        <Select.Option value='15 minutes before'>
          15 minutes before
        </Select.Option>
        <Select.Option value='30 minutes before'>
          30 minutes before
        </Select.Option>
        <Select.Option value='1 hour before'>1 hour before</Select.Option>
        <Select.Option value='2 hours before'>2 hours before</Select.Option>
        <Select.Option value='1 day before'>1 day before</Select.Option>
        <Select.Option value='2 days before'>2 days before</Select.Option>
        <Select.Option value='3 days before'>3 days before</Select.Option>
        <Select.Option value='1 week before'>1 week before</Select.Option>
      </Select>
    </Field>
  );
};

export const PredefinedOptions1EN = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>When would you like an appointment?</Fieldset.Legend>
      <Fieldset.Description>
        Choose from the next five available appointments, or select a later
        time.
      </Fieldset.Description>

      <Radio
        label='Tuesday 17 Feb at 10:00'
        value='2026-02-17T10:00'
        name='appointmentTime'
      />
      <Radio
        label='Tuesday 17 Feb at 14:00'
        value='2026-02-17T14:00'
        name='appointmentTime'
      />
      <Radio
        label='Friday 20 Feb at 13:30'
        value='2026-02-20T13:30'
        name='appointmentTime'
      />
      <Radio
        label='Monday 23 Feb at 08:00'
        value='2026-02-23T08:00'
        name='appointmentTime'
      />
      <Radio
        label='Monday 23 Feb at 08:30'
        value='2026-02-23T08:30'
        name='appointmentTime'
      />

      <a
        href='#let-users-narrow-down-the-options'
        style={{ display: 'flex', marginTop: 'var(--ds-size-6)' }}
      >
        Find available appointments further ahead
      </a>
    </Fieldset>
  );
};

export const PredefinedOptions2EN = () => {
  return (
    <Fieldset>
      <Fieldset.Legend data-size='lg'>
        When would you like an appointment?
      </Fieldset.Legend>
      <Fieldset.Description>
        If some weeks are not available, it means there are no free appointments
        that week. If you prefer Fridays, you can choose a fixed weekday instead
        of a week. You will then see all available appointments on Fridays going
        forward.
      </Fieldset.Description>

      <div style={{ display: 'flex', gap: 'var(--ds-size-6)' }}>
        <Field>
          <Label>Select preferred week</Label>
          <Select defaultValue=''>
            <Select.Option value='' disabled>
              Select a week …
            </Select.Option>
            <Select.Option value='week10'>
              Week 10 (2 March - 8 March)
            </Select.Option>
            <Select.Option value='week11'>
              Week 11 (9 March - 15 March)
            </Select.Option>
            <Select.Option value='week12'>
              Week 12 (16 March - 22 March)
            </Select.Option>
            <Select.Option value='week14'>
              Week 14 (30 March - 5 April)
            </Select.Option>
            <Select.Option value='week15'>
              Week 15 (6 April - 12 April)
            </Select.Option>
            <Select.Option value='week16'>
              Week 16 (13 April - 19 April)
            </Select.Option>
          </Select>
        </Field>

        <Field>
          <Label>Select preferred day</Label>
          <Select defaultValue='Tuesday'>
            <Select.Option value='' disabled>
              Select a day …
            </Select.Option>
            <Select.Option value='Monday'>Monday</Select.Option>
            <Select.Option value='Tuesday'>Tuesday</Select.Option>
            <Select.Option value='Wednesday'>Wednesday</Select.Option>
            <Select.Option value='Thursday'>Thursday</Select.Option>
            <Select.Option value='Friday'>Friday</Select.Option>
          </Select>
        </Field>

        <Field>
          <Label>Select preferred time range</Label>
          <Select defaultValue=''>
            <Select.Option value='' disabled>
              Select a time range …
            </Select.Option>
            <Select.Option value='08-11'>08:00 to 11:00</Select.Option>
            <Select.Option value='11-14'>11:00 to 14:00</Select.Option>
            <Select.Option value='14-17'>14:00 to 17:00</Select.Option>
            <Select.Option value='17-20'>17:00 to 20:00</Select.Option>
          </Select>
        </Field>
      </div>

      <Fieldset style={{ marginTop: 'var(--ds-size-6)' }}>
        <Fieldset.Legend>Select one of the available times</Fieldset.Legend>

        <Radio
          label='Tuesday 17 Feb at 10:00'
          value='2026-02-17T10:00'
          name='appointmentTime'
        />
        <Radio
          label='Tuesday 17 Feb at 14:00'
          value='2026-02-17T14:00'
          name='appointmentTime'
        />
        <Radio
          label='Tuesday 24 Feb at 08:00'
          value='2026-02-24T08:00'
          name='appointmentTime'
        />
        <Radio
          label='Tuesday 24 Feb at 09:30'
          value='2026-02-24T09:30'
          name='appointmentTime'
        />
        <Radio
          label='Tuesday 3 March at 12:30'
          value='2026-03-03T12:30'
          name='appointmentTime'
        />
      </Fieldset>
    </Fieldset>
  );
};
