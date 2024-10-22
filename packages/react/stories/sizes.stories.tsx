import { DivideIcon, PrinterSmallIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';

import { useState } from 'react';
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  Combobox,
  Divider,
  Dropdown,
  ErrorSummary,
  Field,
  Heading,
  HelpText,
  Input,
  Label,
  Link,
  List,
  Modal,
  Pagination,
  Paragraph,
  Popover,
  Radio,
  Search,
  Select,
  Spinner,
  Switch,
  Table,
  Tabs,
  Tag,
  Textfield,
  ToggleGroup,
  Tooltip,
  ValidationMessage,
  usePagination,
} from '../src';

export default {
  title: 'Sizes',
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Sizes: StoryFn = () => {
  const [currentPage, setCurrentPage] = useState(4);
  const { pages, nextButtonProps, prevButtonProps } = usePagination({
    currentPage,
    onChange: console.log, // Open console to see this event
    totalPages: 10,
    showPages: 7,
    setCurrentPage,
  });

  return (
    <div
      style={{
        display: 'grid',
        alignItems: 'start',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
        maxWidth: '90vw',
      }}
    >
      <Accordion data-size='sm'>
        <Accordion.Item>
          <Accordion.Heading>
            Hvem kan registrere seg i Frivillighetsregisteret?
          </Accordion.Heading>
          <Accordion.Content>
            For å kunne bli registrert i Frivillighetsregisteret, må
            organisasjonen drive frivillig virksomhet. Det er bare foreninger,
            stiftelser og aksjeselskap som kan registreres. Virksomheten kan
            ikke dele ut midler til fysiske personer. Virksomheten må ha et
            styre.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <Accordion data-size='md'>
        <Accordion.Item>
          <Accordion.Heading>
            Hvem kan registrere seg i Frivillighetsregisteret?
          </Accordion.Heading>
          <Accordion.Content>
            For å kunne bli registrert i Frivillighetsregisteret, må
            organisasjonen drive frivillig virksomhet. Det er bare foreninger,
            stiftelser og aksjeselskap som kan registreres. Virksomheten kan
            ikke dele ut midler til fysiske personer. Virksomheten må ha et
            styre.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <Accordion data-size='lg'>
        <Accordion.Item>
          <Accordion.Heading>
            Hvem kan registrere seg i Frivillighetsregisteret?
          </Accordion.Heading>
          <Accordion.Content>
            For å kunne bli registrert i Frivillighetsregisteret, må
            organisasjonen drive frivillig virksomhet. Det er bare foreninger,
            stiftelser og aksjeselskap som kan registreres. Virksomheten kan
            ikke dele ut midler til fysiske personer. Virksomheten må ha et
            styre.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <Alert size='sm'>Dette er en alert</Alert>
      <Alert size='md'>Dette er en alert</Alert>
      <Alert size='lg'>Dette er en alert</Alert>
      <div>
        <Avatar size='xs' aria-label='Jan Daniel'>
          JD
        </Avatar>
      </div>
      <div>
        <Avatar size='sm' aria-label='Jan Daniel'>
          JD
        </Avatar>
      </div>
      <div>
        <Avatar size='md' aria-label='Jan Daniel'>
          JD
        </Avatar>
      </div>
      <Badge size='sm' count={99} maxCount={10} />
      <Badge size='md' count={99} maxCount={10} />
      <Badge size='lg' count={99} maxCount={10} />
      <Breadcrumbs size='sm'>
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
      <Breadcrumbs size='md'>
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
      <Breadcrumbs size='lg'>
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
      <div>
        <Button size='sm'>
          <PrinterSmallIcon />
          Klikk her
        </Button>
      </div>
      <div>
        <Button size='md'>
          <PrinterSmallIcon /> Klikk her
        </Button>
      </div>
      <div>
        <Button size='lg'>
          <PrinterSmallIcon /> Klikk her
        </Button>
      </div>
      <Card data-size='sm'>
        <Heading size='xs' level={2}>
          Card Neutral
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
      <Card data-size='md'>
        <Heading size='sm' level={2}>
          Card Neutral
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
      <Card data-size='lg'>
        <Heading size='md' level={2}>
          Card Neutral
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
      <div style={{ display: 'flex', gap: 16 }} data-size='sm'>
        <Chip.Radio>Radio</Chip.Radio>
        <Chip.Checkbox>Check</Chip.Checkbox>
        <Chip.Button>Knapp</Chip.Button>
      </div>
      <div style={{ display: 'flex', gap: 16 }} data-size='md'>
        <Chip.Radio>Radio</Chip.Radio>
        <Chip.Checkbox>Check</Chip.Checkbox>
        <Chip.Button>Knapp</Chip.Button>
      </div>
      <div style={{ display: 'flex', gap: 16 }} data-size='lg'>
        <Chip.Radio>Radio</Chip.Radio>
        <Chip.Checkbox>Check</Chip.Checkbox>
        <Chip.Button>Knapp</Chip.Button>
      </div>
      <div data-size='sm'>
        <Dropdown.Context>
          <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
          <Dropdown>
            <Dropdown.Heading>Heading 1</Dropdown.Heading>
            <Dropdown.List>
              <Dropdown.Item>Button 1.1</Dropdown.Item>
              <Dropdown.Item>Button 1.2</Dropdown.Item>
            </Dropdown.List>
          </Dropdown>
        </Dropdown.Context>
      </div>
      <div data-size='md'>
        <Dropdown.Context>
          <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
          <Dropdown>
            <Dropdown.Heading>Heading 1</Dropdown.Heading>
            <Dropdown.List>
              <Dropdown.Item>Button 1.1</Dropdown.Item>
              <Dropdown.Item>Button 1.2</Dropdown.Item>
            </Dropdown.List>
          </Dropdown>
        </Dropdown.Context>
      </div>
      <div data-size='lg'>
        <Dropdown.Context>
          <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
          <Dropdown>
            <Dropdown.Heading>Heading 1</Dropdown.Heading>
            <Dropdown.List>
              <Dropdown.Item>Button 1.1</Dropdown.Item>
              <Dropdown.Item>Button 1.2</Dropdown.Item>
            </Dropdown.List>
          </Dropdown>
        </Dropdown.Context>
      </div>
      <ErrorSummary size='sm'>
        <ErrorSummary.Heading>
          For å gå videre må du rette opp følgende feil:
        </ErrorSummary.Heading>
        <ErrorSummary.List>
          <ErrorSummary.Item href='#'>
            Fødselsdato kan ikke være etter år 2005
          </ErrorSummary.Item>
          <ErrorSummary.Item href='#'>E-post må være gyldig</ErrorSummary.Item>
        </ErrorSummary.List>
      </ErrorSummary>
      <ErrorSummary size='md'>
        <ErrorSummary.Heading>
          For å gå videre må du rette opp følgende feil:
        </ErrorSummary.Heading>
        <ErrorSummary.List>
          <ErrorSummary.Item href='#'>
            Fødselsdato kan ikke være etter år 2005
          </ErrorSummary.Item>
          <ErrorSummary.Item href='#'>E-post må være gyldig</ErrorSummary.Item>
        </ErrorSummary.List>
      </ErrorSummary>
      <ErrorSummary size='lg'>
        <ErrorSummary.Heading>
          For å gå videre må du rette opp følgende feil:
        </ErrorSummary.Heading>
        <ErrorSummary.List>
          <ErrorSummary.Item href='#'>
            Fødselsdato kan ikke være etter år 2005
          </ErrorSummary.Item>
          <ErrorSummary.Item href='#'>E-post må være gyldig</ErrorSummary.Item>
        </ErrorSummary.List>
      </ErrorSummary>
      <style>
        {
          '.ds-field{display:block}.ds-field input+label {margin: 0;font-weight:normal}'
        }
      </style>{' '}
      {/* TMP fix */}
      <Field data-size='sm'>
        <Label>Text</Label>
        <Input aria-invalid='true' defaultValue='Noe tekst' />
        <ValidationMessage>En feil</ValidationMessage>
      </Field>
      <Field data-size='md'>
        <Label>Text</Label>
        <Input aria-invalid='true' defaultValue='Noe tekst' />
        <ValidationMessage>En feil</ValidationMessage>
      </Field>
      <Field data-size='lg'>
        <Label>Text</Label>
        <Input aria-invalid='true' defaultValue='Noe tekst' />
        <ValidationMessage>En feil</ValidationMessage>
      </Field>
      <Field
        data-size='sm'
        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <Input type='radio' name='my-radio' defaultChecked />
        <Label>Text</Label>
      </Field>
      <Field
        data-size='md'
        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <Input type='radio' name='my-radio' />
        <Label>Text</Label>
      </Field>
      <Field
        data-size='lg'
        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <Input type='radio' name='my-radio' />
        <Label>Text</Label>
      </Field>
      <Field
        data-size='sm'
        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <Input type='checkbox' name='my-check' defaultChecked />
        <Label>Text</Label>
      </Field>
      <Field
        data-size='md'
        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <Input type='checkbox' name='my-check' />
        <Label>Text</Label>
      </Field>
      <Field
        data-size='lg'
        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <Input type='checkbox' name='my-check' />
        <Label>Text</Label>
      </Field>
      <Field
        data-size='sm'
        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <Input type='checkbox' name='my-switch' role='switch' defaultChecked />
        <Label>Text</Label>
      </Field>
      <Field
        data-size='md'
        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <Input type='checkbox' name='my-switch' role='switch' />
        <Label>Text</Label>
      </Field>
      <Field
        data-size='lg'
        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <Input type='checkbox' name='my-switch' role='switch' />
        <Label>Text</Label>
      </Field>
      <HelpText size='sm' aria-label='Mer info'>
        Mer tekst
      </HelpText>
      <HelpText size='md' aria-label='Mer info'>
        Mer tekst
      </HelpText>
      <HelpText size='lg' aria-label='Mer info'>
        Mer tekst
      </HelpText>
      <div data-size='sm'>
        <Link href='#'>Lenke</Link>
      </div>
      <div data-size='md'>
        <Link href='#'>Lenke</Link>
      </div>
      <div data-size='lg'>
        <Link href='#'>Lenke</Link>
      </div>
      <List.Unordered size='sm'>
        <List.Item>List Item 1</List.Item>
        <List.Item>List Item 2</List.Item>
        <List.Item>List Item 3</List.Item>
      </List.Unordered>
      <List.Unordered size='md'>
        <List.Item>List Item 1</List.Item>
        <List.Item>List Item 2</List.Item>
        <List.Item>List Item 3</List.Item>
      </List.Unordered>
      <List.Unordered size='lg'>
        <List.Item>List Item 1</List.Item>
        <List.Item>List Item 2</List.Item>
        <List.Item>List Item 3</List.Item>
      </List.Unordered>
      <Spinner size='sm' title='Loading' />
      <Spinner size='md' title='Loading' />
      <Spinner size='lg' title='Loading' />
      <div data-size='sm'>
        <Modal.Context>
          <Modal.Trigger>Open Modal</Modal.Trigger>
          <Modal>
            <Heading size='xs' style={{ marginBottom: 'var(--ds-spacing-2)' }}>
              Modal header
            </Heading>
            <Paragraph style={{ marginBottom: 'var(--ds-spacing-2)' }}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Blanditiis doloremque obcaecati assumenda odio ducimus sunt et.
            </Paragraph>
          </Modal>
        </Modal.Context>
      </div>
      <div data-size='md'>
        <Modal.Context>
          <Modal.Trigger>Open Modal</Modal.Trigger>
          <Modal>
            <Heading size='xs' style={{ marginBottom: 'var(--ds-spacing-2)' }}>
              Modal header
            </Heading>
            <Paragraph style={{ marginBottom: 'var(--ds-spacing-2)' }}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Blanditiis doloremque obcaecati assumenda odio ducimus sunt et.
            </Paragraph>
          </Modal>
        </Modal.Context>
      </div>
      <div data-size='lg'>
        <Modal.Context>
          <Modal.Trigger>Open Modal</Modal.Trigger>
          <Modal>
            <Heading size='sm' style={{ marginBottom: 'var(--ds-spacing-2)' }}>
              Modal header
            </Heading>
            <Paragraph style={{ marginBottom: 'var(--ds-spacing-2)' }}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Blanditiis doloremque obcaecati assumenda odio ducimus sunt et.
            </Paragraph>
          </Modal>
        </Modal.Context>
      </div>
      <Pagination aria-label='Sidenavigering' size='sm'>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button aria-label='Forrige side' {...prevButtonProps}>
              Forrige
            </Pagination.Button>
          </Pagination.Item>
          {pages.map(({ page, itemKey, buttonProps }) => (
            <Pagination.Item key={itemKey}>
              <Pagination.Button {...buttonProps} aria-label={`Side ${page}`}>
                {page}
              </Pagination.Button>
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Button aria-label='Neste side' {...nextButtonProps}>
              Neste
            </Pagination.Button>
          </Pagination.Item>
        </Pagination.List>
      </Pagination>
      <Pagination aria-label='Sidenavigering' size='md'>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button aria-label='Forrige side' {...prevButtonProps}>
              Forrige
            </Pagination.Button>
          </Pagination.Item>
          {pages.map(({ page, itemKey, buttonProps }) => (
            <Pagination.Item key={itemKey}>
              <Pagination.Button {...buttonProps} aria-label={`Side ${page}`}>
                {page}
              </Pagination.Button>
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Button aria-label='Neste side' {...nextButtonProps}>
              Neste
            </Pagination.Button>
          </Pagination.Item>
        </Pagination.List>
      </Pagination>
      <Pagination aria-label='Sidenavigering' size='lg'>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button aria-label='Forrige side' {...prevButtonProps}>
              Forrige
            </Pagination.Button>
          </Pagination.Item>
          {pages.map(({ page, itemKey, buttonProps }) => (
            <Pagination.Item key={itemKey}>
              <Pagination.Button {...buttonProps} aria-label={`Side ${page}`}>
                {page}
              </Pagination.Button>
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Button aria-label='Neste side' {...nextButtonProps}>
              Neste
            </Pagination.Button>
          </Pagination.Item>
        </Pagination.List>
      </Pagination>
      <div data-size='sm'>
        <Popover.Context>
          <Popover.Trigger>My trigger!</Popover.Trigger>
          <Popover>popover content</Popover>
        </Popover.Context>
      </div>
      <div data-size='md'>
        <Popover.Context>
          <Popover.Trigger>My trigger!</Popover.Trigger>
          <Popover>popover content</Popover>
        </Popover.Context>
      </div>
      <div data-size='lg'>
        <Popover.Context>
          <Popover.Trigger>My trigger!</Popover.Trigger>
          <Popover>popover content</Popover>
        </Popover.Context>
      </div>
      <Table size='sm'>
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
      <Table size='md'>
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
      <Table size='lg'>
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
      <Tabs size='sm' defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
          <Tabs.Tab value='value3'>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
        <Tabs.Panel value='value3'>content 3</Tabs.Panel>
      </Tabs>
      <Tabs size='md' defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
          <Tabs.Tab value='value3'>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
        <Tabs.Panel value='value3'>content 3</Tabs.Panel>
      </Tabs>
      <Tabs size='lg' defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
          <Tabs.Tab value='value3'>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
        <Tabs.Panel value='value3'>content 3</Tabs.Panel>
      </Tabs>
      <Tag size='sm'>Tag</Tag>
      <Tag size='md'>Tag</Tag>
      <Tag size='lg'>Tag</Tag>
      <ToggleGroup size='sm' defaultValue='innboks'>
        <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
        <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
        <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup size='md' defaultValue='innboks'>
        <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
        <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
        <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup size='lg' defaultValue='innboks'>
        <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
        <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
        <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      </ToggleGroup>
      <div data-size='sm'>
        <Tooltip content='Tooltip text'>
          <Button>My tooltip</Button>
        </Tooltip>
      </div>
      <div data-size='md'>
        <Tooltip content='Tooltip text'>
          <Button>My tooltip</Button>
        </Tooltip>
      </div>
      <div data-size='lg'>
        <Tooltip content='Tooltip text'>
          <Button>My tooltip</Button>
        </Tooltip>
      </div>
    </div>
  );
};
