import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Radio } from '.';
import { Button, Fieldset, Paragraph } from '../..';

export default {
  title: 'Komponenter/Radio/Group',
  component: Radio.Group,
} as Meta;

export const Preview: StoryFn<typeof Fieldset> = (args) => {
  const inherit = { readOnly: args.readOnly, size: args.size };
  return (
    <Fieldset {...args}>
      <Radio name='my-radio' size={args.size} label='Vanilje' value='vanilje' />
      <Radio
        name='my-radio'
        size={args.size}
        label='Jordbær'
        value='jordbær'
        description='Jordbær er best'
      />
      <Radio
        name='my-radio'
        size={args.size}
        label='Sjokolade'
        value='sjokolade'
        defaultChecked
      />
      <Radio
        name='my-radio'
        size={args.size}
        label='Jeg spiser ikke iskrem'
        value='spiser-ikke-is'
      />
    </Fieldset>
  );
};

Preview.args = {
  legend: 'Hvilken iskremsmak er best?',
  description: 'Velg din favorittsmak blant alternativene.',
  readOnly: false,
  disabled: false,
  error: '',
  size: 'md',
};

export const WithError: StoryFn<typeof Radio> = () => (
  <Fieldset
    legend='Velg pizza'
    description='Alle pizzaene er laget på våre egne nybakte bunner og serveres med kokkens egen osteblanding og tomatsaus.'
    error='Du må velge en av våre pizzaer for å legge inn bestilling'
  >
    <Radio name='my-radio' label='Bare ost' value='ost' />
    <Radio
      name='my-radio'
      label='Dobbeldekker'
      value='Dobbeldekker'
      description='Chorizo spesial med kokkens luksuskylling'
    />
    <Radio name='my-radio' label='Flammen' value='flammen' />
    <Radio name='my-radio' label='Snadder' value='snadder' />
  </Fieldset>
);

export const Controlled: StoryFn<typeof Radio> = () => {
  const [checked, setChecked] = useState<string>();
  const checkedProps = (value: string) => ({
    checked: value === checked,
    onClick: () => setChecked(value),
    value,
  });

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
        <Button onClick={() => setChecked('flammen')}>Velg Flammen</Button>
        <Button onClick={() => setChecked('snadder')}>Velg Snadder</Button>
        <Paragraph>Du har valgt: {checked}</Paragraph>
      </div>
      <br />
      <Fieldset
        legend='Velg pizza'
        description='Alle pizzaene er laget på våre egne nybakte bunner og serveres med kokkens egen osteblanding og tomatsaus.'
        onChange={(event) => console.log(event)}
      >
        <Radio name='my-radio' label='Bare ost' {...checkedProps('ost')} />
        <Radio
          name='my-radio'
          label='Dobbeldekker'
          description='Chorizo spesial med kokkens luksuskylling'
          {...checkedProps('dobbeldekker')}
        />
        <Radio name='my-radio' label='Flammen' {...checkedProps('flammen')} />
        <Radio name='my-radio' label='Snadder' {...checkedProps('snadder')} />
      </Fieldset>
    </>
  );
};

export const ReadOnly = {
  args: { ...Preview.args, readOnly: true },
  render: Preview,
};

export const Disabled = {
  args: { ...Preview.args, disabled: true },
  render: Preview,
};

export const Inline: StoryFn<typeof Radio.Group> = () => (
  <Fieldset
    legend='Kontaktes på e-post?'
    description='Bekreft om du ønsker å bli kontaktet per e-post. '
  >
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-spacing-6)' }}
    >
      <Radio name='my-radio' value='ja'>
        Ja
      </Radio>
      <Radio name='my-radio' value='nei'>
        Nei
      </Radio>
    </div>
  </Fieldset>
);
