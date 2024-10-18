import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';

import { Radio } from '.';
import { Button, Divider, Fieldset, Paragraph } from '../..';

export default {
  title: 'Komponenter/Radio/Group',
  component: Radio.Group,
} as Meta;

export const Preview: StoryFn<typeof Fieldset> = (args) => {
  const props = {
    'aria-invalid': !!args.error,
    name: 'my-radio',
    readOnly: args.readOnly,
    size: args.size,
  };

  return (
    <Fieldset {...args}>
      <Radio label='Vanilje' value='vanilje' {...props} />
      <Radio
        label='Jordbær'
        value='jordbær'
        description='Jordbær er best'
        {...props}
      />
      <Radio label='Sjokolade' value='sjokolade' defaultChecked {...props} />
      <Radio label='Jeg spiser ikke iskrem' value='spiser-ikke-is' {...props} />
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

export const WithError = {
  args: {
    ...Preview.args,
    error: 'Du må velge jordbær fordi det smaker best',
  },
  render: Preview,
};

export const Controlled: StoryFn<typeof Radio> = () => {
  const [value, setValue] = useState<string>();
  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  return (
    <>
      <Fieldset
        legend='Velg pizza'
        description='Alle pizzaene er laget på våre egne nybakte bunner og serveres med kokkens egen osteblanding og tomatsaus.'
      >
        <Radio
          name='my-radio'
          label='Bare ost'
          value='ost'
          checked={value === 'ost'}
          onChange={onChange}
        />
        <Radio
          name='my-radio'
          label='Dobbeldekker'
          description='Chorizo spesial med kokkens luksuskylling'
          value='dobbeldekker'
          checked={value === 'dobbeldekker'}
          onChange={onChange}
        />
        <Radio
          name='my-radio'
          label='Flammen'
          value='flammen'
          checked={value === 'flammen'}
          onChange={onChange}
        />
        <Radio
          name='my-radio'
          label='Snadder'
          value='snadder'
          checked={value === 'snadder'}
          onChange={onChange}
        />
      </Fieldset>

      <Divider style={{ marginTop: 'var(--ds-spacing-4)' }} />

      <Paragraph style={{ marginBlock: 'var(--ds-spacing-2)' }}>
        Du har valgt: {value}
      </Paragraph>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => setValue('flammen')}>Velg Flammen</Button>
        <Button onClick={() => setValue('snadder')}>Velg Snadder</Button>
      </div>
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
      <Radio name='my-radio' label='Ja' value='ja' />
      <Radio name='my-radio' label='Nei' value='nei' />
    </div>
  </Fieldset>
);
