import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { type ChangeEvent, useState } from 'react';
import {
  Button,
  Divider,
  Fieldset,
  Paragraph,
  Radio,
  type UseRadioProps,
  ValidationMessage,
  useRadio,
} from '../..';

export default {
  title: 'Komponenter/Radio',
  component: Radio,
} as Meta;

export const Preview: StoryObj<typeof Radio> = {
  args: {
    label: 'Radio',
    description: 'Description',
    disabled: false,
    readOnly: false,
    value: 'value',
    'data-size': 'md',
  },
};

export const AriaLabel: StoryObj<typeof Radio> = {
  args: {
    value: 'value',
    'aria-label': 'Radio',
  },
};

export const Group: StoryFn<UseRadioProps & { readOnly?: boolean }> = (
  args,
) => {
  const { getRadioProps, validationMessageProps } = useRadio({
    name: 'mu-radio',
    value: 'sjokolade',
    ...args,
  });

  return (
    <Fieldset>
      <Fieldset.Legend>Hvilken iskremsmak er best?</Fieldset.Legend>
      <Fieldset.Description>
        Velg din favorittsmak blant alternativene.
      </Fieldset.Description>
      <Radio label='Vanilje' {...getRadioProps('vanilje')} />
      <Radio
        label='Jordbær'
        description='Jordbær er best'
        {...getRadioProps('jordbær')}
      />
      <Radio label='Sjokolade' {...getRadioProps('sjokolade')} />
      <Radio
        label='Jeg spiser ikke iskrem'
        {...getRadioProps('spiser-ikke-is')}
      />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};

Group.args = {
  readOnly: false,
  disabled: false,
  error: '',
};

export const WithError = {
  args: {
    ...Group.args,
    error: 'Du må velge jordbær fordi det smaker best', // TODO: useRadio when hook is ready
  },
  render: Group,
};

export const Controlled: StoryFn<typeof Radio> = () => {
  const [value, setValue] = useState<string>();
  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  return (
    <>
      <Fieldset>
        <Fieldset.Legend>Velg pizza</Fieldset.Legend>
        <Fieldset.Description>
          Alle pizzaene er laget på våre egne nybakte bunner og serveres med
          kokkens egen osteblanding og tomatsaus.
        </Fieldset.Description>
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
  <Fieldset>
    <Fieldset.Legend>Kontaktes på e-post?</Fieldset.Legend>
    <Fieldset.Description>
      Bekreft om du ønsker å bli kontaktet per e-post.
    </Fieldset.Description>
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-spacing-6)' }}
    >
      <Radio name='my-radio' label='Ja' value='ja' />
      <Radio name='my-radio' label='Nei' value='nei' />
    </div>
  </Fieldset>
);
