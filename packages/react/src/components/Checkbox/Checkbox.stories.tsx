import { FloppydiskIcon, PencilIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Fieldset,
  Pagination,
  Paragraph,
  Table,
  ValidationMessage,
} from '../..';
import {
  type UseCheckboxGroupProps,
  useCheckboxGroup,
  usePagination,
} from '../../utilities';

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
  },
};

export const AriaLabel: Story = {
  args: {
    value: 'value',
    'aria-label': 'Checkbox',
  },
};

export const Group: StoryFn<UseCheckboxGroupProps> = (args) => {
  const { getCheckboxProps, validationMessageProps } = useCheckboxGroup({
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
      <Checkbox label='E-post' {...getCheckboxProps('epost')} />
      <Checkbox label='Telefon' {...getCheckboxProps('telefon')} />
      <Checkbox label='SMS' {...getCheckboxProps('sms')} />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};

Group.args = {
  name: 'my-group',
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
    name: 'my-error',
    error: 'Du må velge minst to kontaktalternativ', // TODO: useCheckbox when hook is ready
  },
};

export const Controlled: StoryFn<UseCheckboxGroupProps> = (args) => {
  const { getCheckboxProps, validationMessageProps, value, setValue } =
    useCheckboxGroup({
      name: 'my-controlled',
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
        <Checkbox label='Kroatia' {...getCheckboxProps('kroatia')} />
        <Checkbox label='Slovakia' {...getCheckboxProps('slovakia')} />
        <Checkbox label='Hobsyssel' {...getCheckboxProps('hobsyssel')} />
      </Fieldset>
      <ValidationMessage {...validationMessageProps} />
      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />
      <Paragraph style={{ margin: 'var(--ds-size-2) 0' }}>
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
    name: 'my-readonly',
    readOnly: true,
  },
  render: Group,
};

export const Disabled = {
  args: {
    ...Preview.args,
    name: 'my-disabled',
    disabled: true,
  },
  render: Group,
};

const tableData = [
  {
    id: 1,
    navn: 'Lise Nordmann',
    epost: 'lise@nordmann.no',
    telefon: '68051156',
  },
  {
    id: 2,
    navn: 'Kari Nordmann',
    epost: 'kari@nordmann.no',
    telefon: '68059679',
  },
  {
    id: 3,
    navn: 'Ola Nordmann',
    epost: 'ola@nordmann.no',
    telefon: '68055731',
  },
  {
    id: 4,
    navn: 'Per Nordmann',
    epost: 'per@nordmann.no',
    telefon: '68059631',
  },
];

export const InTable: StoryFn<UseCheckboxGroupProps> = (args, context) => {
  const { getCheckboxProps } = useCheckboxGroup({
    name: context.id,
    value: ['2', '3'],
    ...args,
  });

  return (
    <Table>
      <colgroup>
        {/* ensure the first column only takes up the necessary space */}
        <col style={{ width: '1px' }} />
        <col />
        <col />
      </colgroup>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>
            <Checkbox
              aria-label='Velg alle'
              {...getCheckboxProps({
                allowIndeterminate: true,
                value: 'all',
              })}
            />
          </Table.HeaderCell>
          <Table.HeaderCell>Navn</Table.HeaderCell>
          <Table.HeaderCell>E-post</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {tableData.map((person) => (
          <Table.Row key={person.id}>
            <Table.Cell>
              <Checkbox
                aria-labelledby={`${context.id}-${person.id}-name`}
                {...getCheckboxProps(person.id.toString())}
              />
            </Table.Cell>
            <Table.Cell id={`${context.id}-${person.id}-name`}>
              {person.navn}
            </Table.Cell>
            <Table.Cell>{person.epost}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const Conditional: StoryFn<UseCheckboxGroupProps> = (args) => {
  const { getCheckboxProps, validationMessageProps, value } = useCheckboxGroup({
    value: ['epost'],
    ...args,
  });
  const [open, setOpen] = useState(false);

  return (
    <>
      Dine kommunikasjonskanaler: {value.join(', ')}
      {open ? (
        <>
          <Button onClick={() => setOpen(false)}>
            <FloppydiskIcon aria-hidden /> Lagre
          </Button>
          <Fieldset>
            <Fieldset.Legend>
              Hvordan vil du helst at vi skal kontakte deg?
            </Fieldset.Legend>
            <Fieldset.Description>
              Velg alle alternativene som er relevante for deg.
            </Fieldset.Description>
            <Checkbox label='E-post' {...getCheckboxProps('epost')} />
            <Checkbox label='Telefon' {...getCheckboxProps('telefon')} />
            <Checkbox label='SMS' {...getCheckboxProps('sms')} />
            <ValidationMessage {...validationMessageProps} />
          </Fieldset>
        </>
      ) : (
        <Button onClick={() => setOpen(true)} variant='secondary'>
          <PencilIcon aria-hidden /> Rediger
        </Button>
      )}
    </>
  );
};

export const InTableWithPagination: StoryFn<UseCheckboxGroupProps> = (args) => {
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const { getCheckboxProps } = useCheckboxGroup({
    ...args,
  });

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const pagination = usePagination({
    currentPage,
    setCurrentPage,
    totalPages,
    showPages: totalPages,
  });

  // Compute the slice of users to display on the current page
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return tableData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage]);

  return (
    <div>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>
              <Checkbox
                aria-label='Select all'
                {...getCheckboxProps({
                  allowIndeterminate: true,
                  value: 'all',
                })}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>Navn</Table.HeaderCell>
            <Table.HeaderCell>Epost</Table.HeaderCell>
            <Table.HeaderCell>Telefon</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {currentData.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>
                <Checkbox
                  aria-label={'Check ' + user.id}
                  {...getCheckboxProps({
                    value: user.id.toString(),
                  })}
                />
              </Table.Cell>
              <Table.Cell>{user.navn}</Table.Cell>
              <Table.Cell>{user.epost}</Table.Cell>
              <Table.Cell>{user.telefon}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button {...pagination.prevButtonProps}>
              Forrige
            </Pagination.Button>
          </Pagination.Item>
          {pagination.pages.map(({ itemKey, buttonProps, page }) => (
            <Pagination.Item key={itemKey}>
              {typeof page === 'number' && (
                <Pagination.Button {...buttonProps} aria-label={`Side ${page}`}>
                  {page}
                </Pagination.Button>
              )}
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Button {...pagination.nextButtonProps}>
              Neste
            </Pagination.Button>
          </Pagination.Item>
        </Pagination.List>
      </Pagination>
    </div>
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
