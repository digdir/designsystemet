import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button, Paragraph } from '../../..';
import { Checkbox } from '../';

export default {
  title: 'Komponenter/Checkbox/Group',
  component: Checkbox.Group,
} as Meta;

export const Preview: StoryFn<typeof Checkbox.Group> = (args) => (
  <Checkbox.Group {...args}>
    <Checkbox value='epost'>E-post</Checkbox>
    <Checkbox value='telefon'>Telefon</Checkbox>
    <Checkbox value='sms'>SMS</Checkbox>
  </Checkbox.Group>
);

export const OneOption: StoryFn<typeof Checkbox> = () => (
  <Checkbox.Group
    legend='Bekreft at du er over 18 år'
    description='For at vi skal kunne sende deg opplysningen du ber om, må du bekrefte at du er myndig.'
  >
    <Checkbox value='samtykke'>Jeg bekrefter at jeg er over 18 år</Checkbox>
  </Checkbox.Group>
);

Preview.args = {
  legend: 'Hvordan vil du helst at vi skal kontakte deg?',
  description: 'Velg alle alternativene som er relevante for deg.',
  readOnly: false,
  disabled: false,
  error: '',
  size: 'md',
};

export const Error: StoryFn<typeof Checkbox> = () => (
  <Checkbox.Group
    legend='Hvilket land er du statborger i?'
    description='Hvis du har dobbelt statsborgerskap, velger du begge landene.'
    error='Du må velge minst ett land for å kunne gå videre'
  >
    <Checkbox value='norge'>Norge</Checkbox>
    <Checkbox value='europeisk'>Annet europeisk land</Checkbox>
    <Checkbox value='amerikansk'>Amerikansk</Checkbox>
    <Checkbox value='annet'>
      Statsborger i et land utenfor Europa og USA
    </Checkbox>
  </Checkbox.Group>
);

export const Controlled: StoryFn<typeof Checkbox> = () => {
  const [value, setValue] = useState<string[]>([]);

  const myToggle = (val: string) =>
    setValue(
      value.includes(val) ? value.filter((x) => x !== val) : [...value, val],
    );
  return (
    <>
      <span style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => myToggle('kroatia')}>Toggle Kroatia</Button>
        <Button onClick={() => myToggle('hobsyssel')}>Toggle Hobsyssel</Button>
      </span>
      <br />
      <Paragraph spacing>Du har valgt: {value.toString()}</Paragraph>
      <br />
      <Checkbox.Group
        legend='Skal du reise til noen av disse landene?'
        description='Velg alle landene du skal innom.'
        value={value}
        onChange={(value) => setValue(value)}
      >
        <Checkbox value='kroatia'>Kroatia</Checkbox>
        <Checkbox value='slovakia'>Slovakia</Checkbox>
        <Checkbox value='hobsyssel'>Hobsyssel</Checkbox>
        <Paragraph>eller</Paragraph>
        <Checkbox value='ingen'>
          Jeg skal ikke til noen av disse landene
        </Checkbox>
      </Checkbox.Group>
    </>
  );
};

export const ReadOnly = Preview.bind({});

ReadOnly.args = {
  ...Preview.args,
  readOnly: true,
  value: ['epost'],
};

export const Disabled = Preview.bind({});

Disabled.args = {
  ...Preview.args,
  disabled: true,
  value: ['sms'],
};

export const ContentEx1: StoryFn<typeof Checkbox> = () => (
  <Checkbox.Group legend='Hvor lenge har du jobbet i det offentlige?'>
    <Checkbox value='samtykke'>I under ett år</Checkbox>
    <Checkbox value='samtykke'>Fra 1-3 år</Checkbox>
    <Checkbox value='samtykke'>Mer enn 3 år</Checkbox>
  </Checkbox.Group>
);

export const ContentEx2: StoryFn<typeof Checkbox> = () => (
  <Checkbox.Group legend='Hva liker du best med jobben din?'>
    <Checkbox value='selvstendige'>
      Jeg liker å jobbe med selvstendige oppgaver
    </Checkbox>
    <Checkbox value='moter'>Jeg elsker møter</Checkbox>
    <Checkbox value='lunsj'>Lunsjen er best</Checkbox>
    <Checkbox value='kolleger'>Jeg liker å møte kolleger</Checkbox>
  </Checkbox.Group>
);

export const ContentEx3: StoryFn<typeof Checkbox> = () => (
  <Checkbox.Group legend='Hva liker du best med jobben din'>
    <Checkbox value='selvstendige'>Selvstendige oppgaver</Checkbox>
    <Checkbox value='moter'>Møter</Checkbox>
    <Checkbox value='lunsj'>Lunsj</Checkbox>
    <Checkbox value='kolleger'>Kolleger</Checkbox>
  </Checkbox.Group>
);
