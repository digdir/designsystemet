import type { Meta, StoryFn } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import {
  Avatar,
  EXPERIMENTAL_AvatarStack as AvatarStack,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  Details,
  Dialog,
  Divider,
  Dropdown,
  Field,
  Fieldset,
  Heading,
  Input,
  Label,
  Link,
  List,
  Pagination,
  Paragraph,
  Popover,
  Radio,
  Search,
  Select,
  Skeleton,
  SkipLink,
  Spinner,
  EXPERIMENTAL_Suggestion as Suggestion,
  Switch,
  Table,
  Tabs,
  Tag,
  Textarea,
  Textfield,
  ToggleGroup,
  Tooltip,
  ValidationMessage,
} from '../src';

const meta: Meta = {
  title: 'Inverted',
  parameters: {
    layout: 'fullscreen',
    a11y: { manual: true },
  },
  decorators: [
    (Story) => (
      <div data-color-scheme='auto'>
        <Story />
      </div>
    ),
  ],
};

export default meta;

const Demo = ({ label, children }: { label: string; children: ReactNode }) => (
  <section
    data-color='inverted'
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--ds-size-2)',
      background: 'var(--ds-color-background-default)',
      padding: 'var(--ds-size-8)',
    }}
  >
    <Label data-size='sm'>{label}</Label>
    {children}
  </section>
);

export const Inverted: StoryFn = (args) => (
  <div
    {...args}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--ds-size-8)',
      maxWidth: '40rem',
    }}
  >
    <Demo label='Heading'>
      <Heading>Tittel tekst</Heading>
    </Demo>

    <Demo label='Paragraph'>
      <Paragraph>
        Personvernerklæringen gir informasjon om hvilke personopplysninger vi
        behandler, hvordan disse blir behandlet og hvilke rettigheter du har.
      </Paragraph>
    </Demo>

    <Demo label='Label'>
      <Label>Fødselsnummer (11 sifre)</Label>
    </Demo>

    <Demo label='Link'>
      <Link href='https://designsystemet.no'>Gå til designsystemet</Link>
    </Demo>

    <Demo label='Button'>
      <div style={{ display: 'flex', gap: 'var(--ds-size-4)' }}>
        <Button variant='primary'>Primary</Button>
        <Button variant='secondary'>Secondary</Button>
        <Button variant='tertiary'>Tertiary</Button>
      </div>
    </Demo>

    <Demo label='Tag'>
      <Tag>New</Tag>
    </Demo>

    <Demo label='Badge'>
      <Badge count={15} maxCount={9} />
    </Demo>

    <Demo label='Avatar'>
      <Avatar aria-label='Ola Nordmann'>ON</Avatar>
    </Demo>

    <Demo label='AvatarStack'>
      <AvatarStack aria-label='Tre brukere'>
        <Avatar aria-label='Navn' initials='ON' />
        <Avatar aria-label='Navn' initials='KN' />
        <Avatar aria-label='Navn' initials='PN' />
      </AvatarStack>
    </Demo>

    <Demo label='Breadcrumbs'>
      <Breadcrumbs aria-label='Du er her:'>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href='#'>Nivå 1</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href='#'>Nivå 2</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href='#'>Nivå 3</Breadcrumbs.Link>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>
    </Demo>

    <Demo label='Card'>
      <Card style={{ maxWidth: '320px' }}>
        <Heading>Card</Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer.
        </Paragraph>
        <Paragraph data-size='sm'>Footer text</Paragraph>
      </Card>
    </Demo>

    <Demo label='Checkbox'>
      <Checkbox
        label='Checkbox label'
        description='Description'
        value='value'
      />
    </Demo>

    <Demo label='Checkbox group'>
      <Fieldset>
        <Fieldset.Legend>
          Hvordan vil du helst at vi skal kontakte deg?
        </Fieldset.Legend>
        <Fieldset.Description>
          Velg alle alternativene som er relevante for deg.
        </Fieldset.Description>
        <Checkbox label='E-post' />
        <Checkbox label='Telefon' />
        <Checkbox label='SMS' />
      </Fieldset>
    </Demo>

    <Demo label='Radio'>
      <Radio
        label='Radio'
        description='Description'
        value='value'
        name='name'
      />
    </Demo>

    <Demo label='Radio group'>
      <Fieldset>
        <Fieldset.Legend>Hvilken iskremsmak er best?</Fieldset.Legend>
        <Fieldset.Description>
          Velg din favorittsmak blant alternativene.
        </Fieldset.Description>
        <Radio label='Vanilje' value='vanilje' name='icecream' />
        <Radio
          label='Jordbær'
          description='Jordbær er best'
          value='jordbær'
          name='icecream'
        />
        <Radio label='Sjokolade' value='sjokolade' name='icecream' />
        <Radio
          label='Jeg spiser ikke iskrem'
          value='spiser-ikke-is'
          name='icecream'
        />
      </Fieldset>
    </Demo>

    <Demo label='Switch'>
      <Switch label='Switch' />
    </Demo>

    <Demo label='Chip'>
      <div style={{ display: 'flex', gap: 'var(--ds-size-2)' }}>
        <Chip.Radio name='chip' value='nynorsk' defaultChecked>
          Nynorsk
        </Chip.Radio>
        <Chip.Radio name='chip' value='bokmål'>
          Bokmål
        </Chip.Radio>
      </div>
    </Demo>

    <Demo label='Details'>
      <Details>
        <Details.Summary>
          Hvem kan registrere seg i Frivillighetsregisteret?
        </Details.Summary>
        <Details.Content>
          For å kunne bli registrert i Frivillighetsregisteret, må
          organisasjonen drive frivillig virksomhet.
        </Details.Content>
      </Details>
    </Demo>

    <Demo label='Divider'>
      <Divider />
    </Demo>

    <Demo label='Field'>
      <Field>
        <Label>Etternavn</Label>
        <Field.Description>
          Etternavn kan ikke inneholde mellomrom
        </Field.Description>
        <Input defaultValue='Nordmann Svenske' />
        <ValidationMessage>
          Du kan ikke ha mellomrom i etternavnet ditt
        </ValidationMessage>
      </Field>
    </Demo>

    <Demo label='Fieldset'>
      <Fieldset>
        <Fieldset.Legend>Hvilken fjordarm bor du ved?</Fieldset.Legend>
        <Fieldset.Description>
          Valget vil hjelpe oss å forbedre innholdet vi viser deg.
        </Fieldset.Description>
        <Radio label='Barsnesfjorden' name='radio' value='barsnesfjorden' />
        <Radio label='Eidsfjorden' name='radio' value='eidsfjorden' />
        <Radio label='Ingen av de' name='radio' value='ingen-av-de' />
      </Fieldset>
    </Demo>

    <Demo label='Input'>
      <Input aria-label='input' type='text' name='inputs' />
    </Demo>

    <Demo label='Textfield'>
      <Textfield label='Label' />
    </Demo>

    <Demo label='Textarea'>
      <Label htmlFor='inverted-textarea'>Label</Label>
      <Textarea id='inverted-textarea' cols={40} />
    </Demo>

    <Demo label='Search'>
      <Search>
        <Search.Input aria-label='Søk' />
        <Search.Clear />
        <Search.Button />
      </Search>
    </Demo>

    <Demo label='Select'>
      <Field>
        <Label>Velg et fjell</Label>
        <Select defaultValue=''>
          <Select.Option value='' disabled>
            Velg et fjell …
          </Select.Option>
          <Select.Option value='everest'>Mount Everest</Select.Option>
          <Select.Option value='aconcagua'>Aconcagua</Select.Option>
          <Select.Option value='denali'>Denali</Select.Option>
        </Select>
      </Field>
    </Demo>

    <Demo label='Suggestion'>
      <Field>
        <Label>Velg en destinasjon</Label>
        <Suggestion>
          <Suggestion.Input />
          <Suggestion.Clear />
          <Suggestion.List>
            <Suggestion.Empty>Tomt</Suggestion.Empty>
            <Suggestion.Option value='Sogndal'>Sogndal</Suggestion.Option>
            <Suggestion.Option value='Oslo'>Oslo</Suggestion.Option>
          </Suggestion.List>
        </Suggestion>
      </Field>
    </Demo>

    <Demo label='List'>
      <List.Unordered>
        <List.Item>Bøyabreen</List.Item>
        <List.Item>Briksdalsbreen</List.Item>
        <List.Item>Nigardsbreen</List.Item>
      </List.Unordered>
    </Demo>

    <Demo label='Table'>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Header 1</Table.HeaderCell>
            <Table.HeaderCell>Header 2</Table.HeaderCell>
            <Table.HeaderCell>Header 3</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Cell 1</Table.Cell>
            <Table.Cell>Cell 2</Table.Cell>
            <Table.Cell>Cell 3</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Cell 4</Table.Cell>
            <Table.Cell>Cell 5</Table.Cell>
            <Table.Cell>Cell 6</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Demo>

    <Demo label='Tabs'>
      <Tabs defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
          <Tabs.Tab value='value3'>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
        <Tabs.Panel value='value3'>content 3</Tabs.Panel>
      </Tabs>
    </Demo>

    <Demo label='ToggleGroup'>
      <ToggleGroup data-toggle-group='Filtrering' defaultValue='innboks'>
        <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
        <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
        <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
        <ToggleGroup.Item value='sendt'>Sendt</ToggleGroup.Item>
      </ToggleGroup>
    </Demo>

    <Demo label='Pagination'>
      <Pagination>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button aria-label='Forrige side'>
              Forrige
            </Pagination.Button>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Button aria-label='Side 1'>1</Pagination.Button>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Button aria-label='Side 2' aria-current='true'>
              2
            </Pagination.Button>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Button aria-label='Side 3'>3</Pagination.Button>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Button aria-label='Neste side'>Neste</Pagination.Button>
          </Pagination.Item>
        </Pagination.List>
      </Pagination>
    </Demo>

    <Demo label='Skeleton'>
      <Skeleton width={200} height={100} />
    </Demo>

    <Demo label='Spinner'>
      <Spinner aria-label='Henter kaffi' />
    </Demo>

    <Demo label='SkipLink'>
      <SkipLink href='#main-content'>Hopp til hovedinnhold</SkipLink>
    </Demo>

    <Demo label='Tooltip'>
      <Tooltip content='Kopier'>
        <Button>Hold over meg</Button>
      </Tooltip>
    </Demo>

    <Demo label='Dropdown'>
      <Dropdown.TriggerContext>
        <Dropdown.Trigger>Meny</Dropdown.Trigger>
        <Dropdown>
          <Dropdown.List>
            <Dropdown.Item>
              <Dropdown.Button>Valg 1</Dropdown.Button>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Button>Valg 2</Dropdown.Button>
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown>
      </Dropdown.TriggerContext>
    </Demo>

    <Demo label='Popover'>
      <Popover.TriggerContext>
        <Popover.Trigger>Mine varsler</Popover.Trigger>
        <Popover placement='top'>Du har ingen varsler</Popover>
      </Popover.TriggerContext>
    </Demo>

    <Demo label='Dialog'>
      <Dialog.TriggerContext>
        <Dialog.Trigger>Åpne dialog</Dialog.Trigger>
        <Dialog>
          <Heading style={{ marginBottom: 'var(--ds-size-2)' }}>
            Dialog header
          </Heading>
          <Paragraph>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          </Paragraph>
        </Dialog>
      </Dialog.TriggerContext>
    </Demo>
  </div>
);
