import {
  CheckmarkIcon,
  FloppydiskIcon,
  PencilIcon,
  XMarkIcon,
} from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  Field,
  Fieldset,
  Heading,
  Input,
  Label,
  Pagination,
  Paragraph,
  Table,
  ValidationMessage,
} from '../../';
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
type Choices = {
  [key: string]: {
    label: string;
  };
};
export const Controlled: StoryFn<UseCheckboxGroupProps> = (args, context) => {
  const choices: Choices = {
    barnehage: { label: 'Barnehage' },
    grunnskole: { label: 'Grunnskole' },
    videregaende: { label: 'Videregående' },
  };
  const { getCheckboxProps, validationMessageProps, value, setValue } =
    useCheckboxGroup({
      name: 'my-controlled',
      value: ['barnehage', 'videregaende'],
      ...args,
    });

  const toggle = (haystack: string[], needle: string) =>
    haystack.includes(needle)
      ? haystack.filter((value) => value !== needle)
      : haystack.concat(needle);

  const isFiltered = value.length > 0;
  return (
    <>
      <Fieldset>
        <Fieldset.Legend>Utdanningsnivå</Fieldset.Legend>
        {Object.entries(choices).map(([value, { label }]) => (
          <Checkbox
            key={value}
            id={`${context.id}-${value}`}
            label={label}
            {...getCheckboxProps(value)}
          />
        ))}
      </Fieldset>
      <ValidationMessage {...validationMessageProps} />
      <Divider />
      <Paragraph>(Annet innhold)</Paragraph>
      <Divider />
      <div style={{ display: 'flex', gap: 'var(--ds-size-2)' }}>
        <Paragraph>
          {isFiltered ? 'Viser innhold for:' : 'Viser alt innhold'}
        </Paragraph>
        {isFiltered &&
          value.map((v) => (
            <Chip.Removable
              key={v}
              aria-label={`Slett ${choices[v].label}`}
              onClick={() => setValue(toggle(value, v))}
            >
              {choices[v].label}
            </Chip.Removable>
          ))}
      </div>
      {isFiltered && (
        <Button
          style={{ width: 'fit-content' }}
          variant='secondary'
          onClick={() => setValue([])}
        >
          Tøm filtre
        </Button>
      )}
    </>
  );
};
Controlled.parameters = {
  layout: 'padded',
  customStyles: {
    display: 'flex',
    gap: 'var(--ds-size-4)',
    flexDirection: 'column',
  },
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
export const hiddenLegend: StoryFn<typeof Fieldset> = () => (
  <Fieldset>
    <Fieldset.Legend className='ds-sr-only'>
      Tekst for skjermleser
    </Fieldset.Legend>
    <Checkbox label='Test av skjermleser legend' value='selvstendige' />
  </Fieldset>
);

export const Tile: StoryFn<UseCheckboxGroupProps> = () => {
  return (
    <>
      <Fieldset className='ds-selection-tile'>
        <Fieldset.Legend>
          This is a Fieldset with className="ds-selection-tile"
        </Fieldset.Legend>
        <Fieldset.Description>
          The checkboxes get tile styling
        </Fieldset.Description>
        <Checkbox
          label='with description'
          description='description text'
          value='description'
        />
        <Checkbox label='Checked' value='checked' checked />
        <Checkbox
          label='with error state'
          value='error'
          error='the error message'
        />
        <Checkbox disabled label='disabled' value='disabled' />
        <Checkbox readOnly label='readonly checked' value='readonly' checked />
      </Fieldset>
      <Heading style={{ marginTop: 'var(--ds-size-8)' }} level={2}>
        Card examples
      </Heading>
      <Card
        style={{ marginTop: 'var(--ds-size-4)' }}
        className='ds-selection-tile'
        data-clickdelegatefor='card-test'
      >
        <Checkbox id='card-test' label='Lunsj' value='lunsj' />
        <Paragraph>
          This is a card with className="ds-selection-tile" and the checkbox as
          the click delegate.
        </Paragraph>
      </Card>
      <Card
        style={
          {
            marginTop: 'var(--ds-size-8)',
            '--dsc-tile-background--checked':
              'var(--ds-color-background-tinted)',
          } as CSSProperties
        }
        className='ds-selection-tile'
        data-clickdelegatefor='card-test2'
      >
        <Heading level={3}>Hello</Heading>
        <Paragraph>
          This is a card with className="ds-selection-tile" and a hidden
          checkbox as the click delegate. The background-color when checked was
          overidden.
        </Paragraph>
        <Paragraph>
          Notice that the heading gets underline due to selector in input.
          Should this be changed to only count for links?
        </Paragraph>

        <Checkbox
          id='card-test2'
          label='hidden'
          value='hidden'
          className='ds-sr-only'
        />
      </Card>

      <Card
        style={{ marginTop: 'var(--ds-size-8)' }}
        className='ds-selection-tile' /* test that tile does nothing when there are no selection controls */
        data-clickdelegatefor='button-test'
      >
        <Heading level={3}>Hello</Heading>
        <Paragraph>
          This is a card with className="ds-selection-tile" and a button as the
          click delegate (so className="ds-selection-tile" should do nothing)
        </Paragraph>
        <Button id='button-test'>Button is left alone</Button>
      </Card>
      <Heading style={{ marginTop: 'var(--ds-size-8)' }} level={2}>
        Kystbussen example
      </Heading>
      <div style={{ width: '320px' }}>
        <Card
          style={{ marginTop: 'var(--ds-size-4)' }}
          className='ds-selection-tile'
          data-clickdelegatefor='entur-case1'
        >
          <Field
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ds-size-2)',
              width: 'auto',
            }}
          >
            <Input id='entur-case1' type='radio' name='entur' />
            <Label
              className='ds-heading'
              weight='regular'
              style={{
                marginRight: 'auto',
                paddingInline: '0',
                textBox: 'trim-start cap alphapbetic',
              }}
            >
              Standard
            </Label>
            <Field.Description>199,-</Field.Description>
          </Field>
          <Divider />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 'var(--ds-size-2)',
            }}
          >
            <XMarkIcon fontSize='2rem' aria-hidden='true' />
            <Paragraph>Ikke Refunderbar</Paragraph>
            <CheckmarkIcon
              fontSize='2rem'
              aria-hidden='true'
              color='var(--ds-color-success-base-default)'
            />
            <Paragraph>Kan endres frem til 1 time før avgang.</Paragraph>
          </div>
        </Card>
        <Card
          style={{ marginTop: 'var(--ds-size-4)' }}
          className='ds-selection-tile'
          data-clickdelegatefor='entur-case2'
        >
          <Field
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ds-size-1)',
              width: 'auto',
            }}
          >
            <Input id='entur-case2' type='radio' name='entur' />
            <Label
              className='ds-heading'
              weight='regular'
              style={{
                marginRight: 'auto',
                paddingInline: '0',
                textBox: 'trim-start cap alphapbetic',
              }}
            >
              Fleksibel
            </Label>
            <Field.Description>299,-</Field.Description>
          </Field>
          <Divider />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 'var(--ds-size-1)',
            }}
          >
            <CheckmarkIcon
              fontSize='2rem'
              aria-hidden='true'
              color='var(--ds-color-success-base-default)'
            />
            <Paragraph>Refunderbar billett</Paragraph>
            <CheckmarkIcon
              fontSize='2rem'
              aria-hidden='true'
              color='var(--ds-color-success-base-default)'
            />
            <Paragraph>
              Kan endres uten endringsgebyr frem til 15 minutter før avgang.
            </Paragraph>
          </div>
        </Card>
      </div>
    </>
  );
};
