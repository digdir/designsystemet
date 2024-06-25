import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button, Paragraph } from '../../..';
import { Radio } from '../';

export default {
  title: 'Komponenter/Radio/Group',
  component: Radio.Group,
} as Meta;

export const Preview: StoryFn<typeof Radio.Group> = (args) => (
  <Radio.Group {...args}>
    <Radio value='vanilje'>Vanilje</Radio>
    <Radio
      value='jordbær'
      description='Jordbær er best'
    >
      Jordbær
    </Radio>
    <Radio value='sjokolade'>Sjokolade</Radio>
    <Radio value='spiser-ikke-is'>Jeg spiser ikke iskrem</Radio>
  </Radio.Group>
);

Preview.args = {
  legend: 'Hvilken iskremsmak er best?',
  description: 'Velg din favorittsmak blant alternativene.',
  readOnly: false,
  disabled: false,
  error: '',
  size: 'md',
};

export const Error: StoryFn<typeof Radio> = () => (
  <Radio.Group
    legend='Velg pizza'
    description='Alle pizzaene er laget på våre egne nybakte bunner og serveres med kokkens egen osteblanding og tomatsaus.'
    error='Du må velge en av våre pizzaer for å legge inn bestilling'
  >
    <Radio value='ost'>Bare ost</Radio>
    <Radio
      value='Dobbeldekker'
      description='Chorizo spesial med kokkens luksuskylling'
    >
      Dobbeldekker
    </Radio>
    <Radio value='flammen'>Flammen</Radio>
    <Radio value='snadder'>Snadder</Radio>
  </Radio.Group>
);

export const Controlled: StoryFn<typeof Radio> = () => {
  const [value, setValue] = useState<string>();

  return (
    <>
      <span style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
        <Button onClick={() => setValue('flammen')}>Velg Flammen</Button>
        <Button onClick={() => setValue('snadder')}>Velg Snadder</Button>
        <Paragraph spacing>Du har valgt: {value}</Paragraph>
      </span>
      <br />
      <Radio.Group
        legend='Velg pizza'
        description='Alle pizzaene er laget på våre egne nybakte bunner og serveres med kokkens egen osteblanding og tomatsaus.'
        value={value}
        onChange={setValue}
      >
        <Radio value='ost'>Bare ost</Radio>
        <Radio
          value='Dobbeldekker'
          description='Chorizo spesial med kokkens luksuskylling'
        >
          Dobbeldekker
        </Radio>
        <Radio value='flammen'>Flammen</Radio>
        <Radio value='snadder'>Snadder</Radio>
      </Radio.Group>
    </>
  );
};

export const ReadOnly = Preview.bind({});

ReadOnly.args = {
  ...Preview.args,
  readOnly: true,
  value: 'jordbær',
};

export const Disabled = Preview.bind({});

Disabled.args = {
  ...Preview.args,
  disabled: true,
  value: 'sjokolade',
};

export const Inline: StoryFn<typeof Radio.Group> = () => (
  <Radio.Group
    legend='Kontaktes på epost?'
    description='Bekreft om du ønsker å bli kontaktet per epost. '
    inline
  >
    <Radio value='ja'>Ja</Radio>
    <Radio value='nei'>Nei</Radio>
  </Radio.Group>
);
