import type { Meta, StoryFn, StoryObj } from '@storybook/react';
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
  const { getProps, validationMessageProps } = useRadio({
    name: 'my-radio',
    value: 'sjokolade',
    ...args,
  });

  return (
    <Fieldset>
      <Fieldset.Legend>Hvilken iskremsmak er best?</Fieldset.Legend>
      <Fieldset.Description>
        Velg din favorittsmak blant alternativene.
      </Fieldset.Description>
      <Radio label='Vanilje' {...getProps('vanilje')} />
      <Radio
        label='Jordbær'
        description='Jordbær er best'
        {...getProps('jordbær')}
      />
      <Radio label='Sjokolade' {...getProps('sjokolade')} />
      <Radio label='Jeg spiser ikke iskrem' {...getProps('spiser-ikke-is')} />
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
    error: 'Du må velge jordbær fordi det smaker best',
  },
  render: Group,
};

export const Controlled: StoryFn<UseRadioProps> = (args) => {
  const { value, setValue, getProps, validationMessageProps } = useRadio({
    name: 'my-radio',
    ...args,
  });

  return (
    <>
      <Fieldset>
        <Fieldset.Legend>Velg pizza</Fieldset.Legend>
        <Fieldset.Description>
          Alle pizzaene er laget på våre egne nybakte bunner og serveres med
          kokkens egen osteblanding og tomatsaus.
        </Fieldset.Description>
        <Radio label='Bare ost' {...getProps('ost')} />
        <Radio
          label='Dobbeldekker'
          description='Chorizo spesial med kokkens luksuskylling'
          {...getProps('dobbeldekker')}
        />
        <Radio label='Flammen' {...getProps('flammen')} />
        <Radio label='Snadder' {...getProps('snadder')} />
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
