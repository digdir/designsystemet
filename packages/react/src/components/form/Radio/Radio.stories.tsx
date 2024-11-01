import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import {
  Button,
  Divider,
  Fieldset,
  Paragraph,
  Radio,
  type UseRadioGroupProps,
  ValidationMessage,
  useRadioGroup,
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

export const Group: StoryFn<UseRadioGroupProps> = (args) => {
  const { getRadioProps, validationMessageProps } = useRadioGroup(args);

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
  name: 'my-group',
  readOnly: false,
  disabled: false,
  error: '',
  value: 'sjokolade',
};

export const WithError = {
  args: {
    ...Group.args,
    error: 'Du må velge jordbær fordi det smaker best',
    name: 'my-error',
  },
  render: Group,
};

export const Controlled: StoryFn<UseRadioGroupProps> = (args) => {
  const { value, setValue, getRadioProps } = useRadioGroup({
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
        <Radio label='Bare ost' {...getRadioProps('ost')} />
        <Radio
          label='Dobbeldekker'
          description='Chorizo spesial med kokkens luksuskylling'
          {...getRadioProps('dobbeldekker')}
        />
        <Radio label='Flammen' {...getRadioProps('flammen')} />
        <Radio label='Snadder' {...getRadioProps('snadder')} />
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
  args: { ...Group.args, readOnly: true, name: 'my-readonly' },
  render: Group,
};

export const Disabled = {
  args: { ...Group.args, disabled: true, name: 'my-disabled' },
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
      <Radio name='my-inline' label='Ja' value='ja' />
      <Radio name='my-inline' label='Nei' value='nei' />
    </div>
  </Fieldset>
);
