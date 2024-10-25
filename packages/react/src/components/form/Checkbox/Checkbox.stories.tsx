import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';

import { Button, Checkbox, Divider, Fieldset, Paragraph } from '../..';

type Story = StoryObj<typeof Checkbox>;

export default {
  title: 'Komponenter/Checkbox',
  component: Checkbox,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Checkbox label',
    description: 'Description',
    disabled: false,
    readOnly: false,
    value: 'value',
    'data-size': 'md',
    indeterminate: false,
  },
};

export const AriaLabel: Story = {
  args: {
    value: 'value',
    'aria-label': 'Checkbox',
  },
};

export const Group: StoryFn<typeof Fieldset> = (args) => {
  const props = {
    'aria-invalid': !!args.error,
    'data-size': args.size,
  };

  return (
    <Fieldset {...args}>
      <Checkbox label='E-post' value='epost' {...props} defaultChecked />
      <Checkbox label='Telefon' value='telefon' {...props} />
      <Checkbox label='SMS' value='sms' {...props} />
    </Fieldset>
  );
};

Group.args = {
  legend: 'Hvordan vil du helst at vi skal kontakte deg?',
  description: 'Velg alle alternativene som er relevante for deg.',
  disabled: false,
  error: '',
  size: 'md',
};

export const OneOption: StoryFn<typeof Fieldset> = () => (
  <Fieldset
    legend='Bekreft at du er over 18 år'
    description='For at vi skal kunne sende deg opplysningen du ber om, må du bekrefte at du er myndig.'
  >
    <Checkbox label='Jeg bekrefter at jeg er over 18 år' value='samtykke' />
  </Fieldset>
);

export const WithError = {
  args: {
    ...Group.args,
    error: 'Du må velge minst to kontaktalternativ',
  },
  render: Group,
};

export const Controlled: StoryFn<typeof Checkbox> = () => {
  // TODO: useCheckbox when hook is ready
  const [values, setValues] = useState<string[]>([]);
  const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const values = Array.from(document.getElementsByTagName('input'))
      .filter(({ name, checked }) => name === target.name && checked)
      .map(({ value }) => value);
    setValues(values);
  };
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
    ...Group.args,
    readOnly: true,
  },
  render: Group,
};

export const Disabled = {
  args: {
    ...Preview.args,
    disabled: true,
  },
  render: Group,
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
