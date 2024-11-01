import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import {
  Button,
  Checkbox,
  Divider,
  Fieldset,
  Paragraph,
  Table,
  type UseCheckboxProps,
  ValidationMessage,
  useCheckbox,
} from '../..';

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
  },
};

export const AriaLabel: Story = {
  args: {
    value: 'value',
    'aria-label': 'Checkbox',
  },
};

export const Group: StoryFn<UseCheckboxProps> = (args) => {
  const { getProps, validationMessageProps } = useCheckbox({
    name: 'my-checkbox',
    value: ['epost'],
    ...args,
  });

  return (
    <Fieldset>
      <Fieldset.Legend>
        Hvordan vil du helst at vi skal kontakte deg?
      </Fieldset.Legend>
      <Fieldset.Description>
        Velg alle alternativene som er relevante for deg.
      </Fieldset.Description>
      <Checkbox label='E-post' {...getProps('epost')} />
      <Checkbox label='Telefon' {...getProps('telefon')} />
      <Checkbox label='SMS' {...getProps('sms')} />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};

Group.args = {
  disabled: false,
  error: '',
};

export const OneOption: StoryFn<typeof Fieldset> = () => (
  <Fieldset>
    <Fieldset.Legend>Bekreft at du er over 18 år</Fieldset.Legend>
    <Fieldset.Description>
      For at vi skal kunne sende deg opplysningen du ber om, må du bekrefte at
      du er myndig.
    </Fieldset.Description>
    <Checkbox label='Jeg bekrefter at jeg er over 18 år' value='samtykke' />
  </Fieldset>
);

export const WithError = {
  render: Group,
  args: {
    ...Group.args,
    error: 'Du må velge minst to kontaktalternativ', // TODO: useCheckbox when hook is ready
  },
};

export const Controlled: StoryFn<UseCheckboxProps> = (args) => {
  const { getProps, validationMessageProps, value, setValue } = useCheckbox({
    name: 'my-checkbox',
    ...args,
  });

  const toggle = (haystack: string[], needle: string) =>
    haystack.includes(needle)
      ? haystack.filter((value) => value !== needle)
      : haystack.concat(needle);

  return (
    <>
      <Fieldset>
        <Fieldset.Legend>
          Skal du reise til noen av disse landene?
        </Fieldset.Legend>
        <Fieldset.Description>
          Velg alle landene du skal innom.
        </Fieldset.Description>
        <Checkbox label='Kroatia' {...getProps('kroatia')} />
        <Checkbox label='Slovakia' {...getProps('slovakia')} />
        <Checkbox label='Hobsyssel' {...getProps('hobsyssel')} />
      </Fieldset>
      <ValidationMessage {...validationMessageProps} />
      <Divider style={{ marginTop: 'var(--ds-spacing-4)' }} />
      <Paragraph style={{ margin: 'var(--ds-spacing-2) 0' }}>
        Du har valgt: {value.toString()}
      </Paragraph>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => setValue(toggle(value, 'kroatia'))}>
          Toggle Kroatia
        </Button>
        <Button onClick={() => setValue(toggle(value, 'hobsyssel'))}>
          Toggle Hobsyssel
        </Button>
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

export const InTable: StoryFn<UseCheckboxProps> = (args) => {
  const { getProps, getIndeterminateProps } = useCheckbox({
    name: 'my-checkbox',
    ...args,
  });

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>
            <Checkbox aria-label='Select all' {...getIndeterminateProps()} />
          </Table.HeaderCell>
          <Table.HeaderCell>Header</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {[1, 2, 3, 4].map((row) => (
          <Table.Row key={row}>
            <Table.Cell>
              <Checkbox aria-label={`Check ${row}`} {...getProps(`${row}`)} />
            </Table.Cell>
            <Table.Cell>Content</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const ContentEx1: StoryFn<typeof Fieldset> = () => (
  <Fieldset>
    <Fieldset.Legend>
      Hvor lenge har du jobbet i det offentlige?
    </Fieldset.Legend>
    <Checkbox label='I under ett år' value='0-3' />
    <Checkbox label='Fra 1-3 år' value='1-3' />
    <Checkbox label='Mer enn 3 år' value='3+' />
  </Fieldset>
);

export const ContentEx2: StoryFn<typeof Fieldset> = () => (
  <Fieldset>
    <Fieldset.Legend>Hva liker du best med jobben din?</Fieldset.Legend>
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
  <Fieldset>
    <Fieldset.Legend>Hva liker du best med jobben din?</Fieldset.Legend>
    <Checkbox label='Selvstendige oppgaver' value='selvstendige' />
    <Checkbox label='Møter' value='moter' />
    <Checkbox label='Lunsj' value='lunsj' />
    <Checkbox label='Kolleger' value='kolleger' />
  </Fieldset>
);
