import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';

import { Checkbox } from '.';
import { Button, Divider, Fieldset, Paragraph } from '../..';

export default {
  title: 'Komponenter/Checkbox/Group',
  component: Checkbox.Group,
} as Meta;

export const Preview: StoryFn<typeof Fieldset> = (args) => {
  const props = {
    'aria-invalid': !!args.error,
    readOnly: args.readOnly,
    size: args.size,
  };

  return (
    <Fieldset {...args}>
      <Checkbox label='E-post' value='epost' {...props} defaultChecked />
      <Checkbox label='Telefon' value='telefon' {...props} />
      <Checkbox label='SMS' value='sms' {...props} />
    </Fieldset>
  );
};

export const OneOption: StoryFn<typeof Fieldset> = () => (
  <Fieldset
    legend='Bekreft at du er over 18 år'
    description='For at vi skal kunne sende deg opplysningen du ber om, må du bekrefte at du er myndig.'
  >
    <Checkbox label='Jeg bekrefter at jeg er over 18 år' value='samtykke' />
  </Fieldset>
);

Preview.args = {
  legend: 'Hvordan vil du helst at vi skal kontakte deg?',
  description: 'Velg alle alternativene som er relevante for deg.',
  readOnly: false,
  disabled: false,
  error: '',
  size: 'md',
};

export const WithError = {
  args: {
    ...Preview.args,
    error: 'Du må velge minst to kontaktalternativ',
  },
  render: Preview,
};

export const Controlled: StoryFn<typeof Checkbox> = () => {
  const [values, setValues] = useState<string[]>([]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValues(Checkbox.getValues(event));
  const myToggle = (value: string) =>
    setValues(
      values.includes(value)
        ? values.filter((val) => val !== value)
        : [...values, value],
    );
  return (
    <>
      <Fieldset
        legend='Skal du reise til noen av disse landene?'
        description='Velg alle landene du skal innom.'
      >
        <Checkbox
          label='Kroatia'
          value='kroatia'
          checked={values.includes('kroatia')}
          onChange={onChange}
        />
        <Checkbox
          label='Slovakia'
          value='slovakia'
          checked={values.includes('slovakia')}
          onChange={onChange}
        />
        <Checkbox
          label='Hobsyssel'
          value='hobsyssel'
          checked={values.includes('hobsyssel')}
          onChange={onChange}
        />
        <Paragraph>eller</Paragraph>
        <Checkbox
          label='Jeg skal ikke til noen av disse landene'
          value='ingen'
          checked={values.includes('ingen')}
          onChange={onChange}
        />
      </Fieldset>
      <Divider style={{ marginTop: 'var(--ds-spacing-4)' }} />
      <Paragraph style={{ margin: 'var(--ds-spacing-2) 0' }}>
        Du har valgt: {values.toString()}
      </Paragraph>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => myToggle('kroatia')}>Toggle Kroatia</Button>
        <Button onClick={() => myToggle('hobsyssel')}>Toggle Hobsyssel</Button>
      </div>
    </>
  );
};

export const ReadOnly = {
  args: {
    ...Preview.args,
    readOnly: true,
  },
  render: Preview,
};

export const Disabled = {
  args: {
    ...Preview.args,
    disabled: true,
  },
  render: Preview,
};

export const ContentEx1: StoryFn<typeof Fieldset> = () => (
  <Fieldset legend='Hvor lenge har du jobbet i det offentlige?'>
    <Checkbox label='I under ett år' value='0-3' />
    <Checkbox label='Fra 1-3 år' value='1-3' />
    <Checkbox label='Mer enn 3 år' value='3+' />
  </Fieldset>
);

export const ContentEx2: StoryFn<typeof Fieldset> = () => (
  <Fieldset legend='Hva liker du best med jobben din?'>
    <Checkbox
      label='Jeg liker å jobbe med selvstendige oppgaver'
      value='selvstendige'
    />
    <Checkbox label='Jeg elsker møter' value='moter' />
    <Checkbox label='Lunsjen er best' value='lunsj' />
    <Checkbox label='Jeg liker å møte kolleger' value='kolleger' />
  </Fieldset>
);

export const ContentEx3: StoryFn<typeof Fieldset> = () => (
  <Fieldset legend='Hva liker du best med jobben din'>
    <Checkbox label='Selvstendige oppgaver' value='selvstendige' />
    <Checkbox label='Møter' value='moter' />
    <Checkbox label='Lunsj' value='lunsj' />
    <Checkbox label='Kolleger' value='kolleger' />
  </Fieldset>
);
