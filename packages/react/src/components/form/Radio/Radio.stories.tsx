import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Divider, Fieldset, Paragraph, Radio } from '../..';

type Story = StoryObj<typeof Radio>;

export default {
  title: 'Komponenter/Radio',
  component: Radio,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Radio',
    description: 'Description',
    disabled: false,
    readOnly: false,
    value: 'value',
    size: 'md',
  },
};

export const AriaLabel: Story = {
  args: {
    value: 'value',
    'aria-label': 'Radio',
  },
};

export const Group: StoryFn<typeof Fieldset> = (args) => {
  const props = {
    'aria-invalid': !!args.error,
    name: 'my-radio',
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

Group.args = {
  legend: 'Hvilken iskremsmak er best?',
  description: 'Velg din favorittsmak blant alternativene.',
  disabled: false,
  error: '',
  size: 'md',
};

export const WithError = {
  args: {
    ...Group.args,
    error: 'Du må velge jordbær fordi det smaker best',
  },
  render: Group,
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
  args: { ...Group.args, readOnly: true },
  render: Group,
};

export const Disabled = {
  args: { ...Group.args, disabled: true },
  render: Group,
};

export const Inline: StoryFn<typeof Fieldset> = () => (
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
