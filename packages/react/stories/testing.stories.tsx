import { PrinterSmallIcon } from '@navikt/aksel-icons';
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
import type { Size } from '../src/types';

export default {
  title: 'Testing',
  parameters: {
    a11y: {
      /*
      These stories only exist to test sizing/alignment, so we don't want to
      do the work to add correct aria attributes.
      */
      disable: true,
    },
    customStyles: {
      padding: 'var(--ds-spacing-4)',
      background: 'var(--ds-color-neutral-background-default)',
      borderRadius: 'var(--ds-border-radius-md)',
    },
  },
} as Meta;

export const MediumRow: StoryFn<{
  size: 'sm' | 'md' | 'lg';
  direction: 'column' | 'row';
}> = ({ size, direction = 'row' }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 'var(--ds-spacing-2)',
          background: 'rgba(255 0 0/0.3)',
          flexDirection: direction,
        }}
      >
        <Textfield
          hideLabel
          label='Kontroller meg!'
          data-size={size}
          prefix='prefix'
          suffix='suffix'
        />

        <Select data-size={size}>
          <Select.Option>opt1</Select.Option>
          <Select.Option>opt2</Select.Option>
          <Select.Option>opt3</Select.Option>
        </Select>
        <Button data-size={size}>Knapp</Button>
        <Combobox data-size={size}>
          <Combobox.Option value='sogndal'>Sogndal</Combobox.Option>
          <Combobox.Option value='stavanger'>Stavanger</Combobox.Option>
        </Combobox>
      </div>
      <br />
      <div
        style={{
          display: 'flex',
          gap: 'var(--ds-spacing-2)',
          background: 'rgba(255 0 0/0.3)',
          alignItems: 'flex-start',
          flexDirection: direction,
        }}
      >
        <Switch data-size={size}>Switch</Switch>
        <Switch data-size={size} aria-label='no label switch'></Switch>
        <Chip.Checkbox>Toggle</Chip.Checkbox>
        <Chip.Removable>Removable</Chip.Removable>
        <Tag data-size={size}>Tag</Tag>

        <Radio label='Radio' value='radio' data-size={size} />
        <Radio
          value='radio2'
          data-size={size}
          aria-label='no label radio'
        ></Radio>
        <Checkbox label='Checkbox' value='checkbox' data-size={size} />
        <Checkbox
          value='checkbox2'
          data-size={size}
          aria-label='no label checkbox'
        />
      </div>
    </>
  );
};

export const SmallRow = MediumRow.bind({});

SmallRow.args = {
  size: 'sm',
};

export const LargeRow = MediumRow.bind({});

LargeRow.args = {
  size: 'lg',
};

export const SmallCol = MediumRow.bind({});

SmallCol.args = {
  size: 'sm',
  direction: 'column',
};
export const MediumCol = MediumRow.bind({});

MediumCol.args = {
  size: 'md',
  direction: 'column',
};

export const LargeCol = MediumRow.bind({});

LargeCol.args = {
  size: 'lg',
  direction: 'column',
};

const sizes: Size[] = ['sm', 'md', 'lg'];

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
      {sizes.map((size) => (
        <div key={size}>
          <h3>{size.toUpperCase()}</h3>
        </div>
      ))}
      {sizes.map((size) => (
        <Accordion key={size} data-size={size}>
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
      ))}
      {sizes.map((size) => (
        <Alert key={size} data-size={size}>
          Dette er en alert
        </Alert>
      ))}
      {sizes.map((size) => (
        <div key={size}>
          <Avatar data-size={size} aria-label='Jan Daniel'>
            JD
          </Avatar>
        </div>
      ))}
      {sizes.map((size) => (
        <Badge key={size} data-size={size} count={99} maxCount={10} />
      ))}
      {sizes.map((size) => (
        <Breadcrumbs key={size} data-size={size}>
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
      ))}
      {sizes.map((size) => (
        <div key={size}>
          <Button data-size={size}>
            <PrinterSmallIcon />
            Klikk her
          </Button>
        </div>
      ))}
      {sizes.map((size) => (
        <Card key={size} data-size={size}>
          <Heading>Card Neutral</Heading>
          <Paragraph>
            Most provide as with carried business are much better more the
            perfected designer. Writing slightly explain desk unable at
            supposedly about this
          </Paragraph>
        </Card>
      ))}
      {sizes.map((size) => (
        <div
          key={size}
          style={{ display: 'flex', gap: 'var(--ds-sizing-2)' }}
          data-size={size}
        >
          <Chip.Radio>Radio</Chip.Radio>
          <Chip.Checkbox>Check</Chip.Checkbox>
          <Chip.Button>Knapp</Chip.Button>
        </div>
      ))}
      {sizes.map((size) => (
        <div key={size} data-size={size}>
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
      ))}
      {sizes.map((size) => (
        <ErrorSummary key={size} data-size={size}>
          <ErrorSummary.Heading>
            For å gå videre må du rette opp følgende feil:
          </ErrorSummary.Heading>
          <ErrorSummary.List>
            <ErrorSummary.Item href='#'>
              Fødselsdato kan ikke være etter år 2005
            </ErrorSummary.Item>
            <ErrorSummary.Item href='#'>
              E-post må være gyldig
            </ErrorSummary.Item>
          </ErrorSummary.List>
        </ErrorSummary>
      ))}
      {sizes.map((size) => (
        <Field key={size} data-size={size}>
          <Label>Text</Label>
          <Input aria-invalid='true' defaultValue='Noe tekst' />
          <ValidationMessage>En feil</ValidationMessage>
        </Field>
      ))}
      {sizes.map((size) => (
        <Field key={size} data-size={size}>
          <Input type='radio' name='my-radio' defaultChecked />
          <Label>Text</Label>
        </Field>
      ))}
      {sizes.map((size) => (
        <Field key={size} data-size={size}>
          <Input type='checkbox' name='my-check' defaultChecked />
          <Label>Text</Label>
        </Field>
      ))}
      {sizes.map((size) => (
        <Field key={size} data-size={size}>
          <Input
            type='checkbox'
            name='my-switch'
            role='switch'
            defaultChecked
          />
          <Label>Text</Label>
        </Field>
      ))}
      {sizes.map((size) => (
        <HelpText key={size} data-size={size} aria-label='Mer info'>
          Mer tekst
        </HelpText>
      ))}
      {sizes.map((size) => (
        <div key={size} data-size={size}>
          <Link href='#'>Lenke</Link>
        </div>
      ))}
      {sizes.map((size) => (
        <List.Unordered key={size} data-size={size}>
          <List.Item>List Item 1</List.Item>
          <List.Item>List Item 2</List.Item>
          <List.Item>List Item 3</List.Item>
        </List.Unordered>
      ))}
      {sizes.map((size) => (
        <Spinner key={size} data-size={size} aria-label='Loading' />
      ))}
      {sizes.map((size) => (
        <div key={size} data-size={size}>
          <Modal.Context>
            <Modal.Trigger>Open Modal</Modal.Trigger>
            <Modal>
              <Heading style={{ marginBottom: 'var(--ds-spacing-2)' }}>
                Modal header
              </Heading>
              <Paragraph style={{ marginBottom: 'var(--ds-spacing-2)' }}>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Blanditiis doloremque obcaecati assumenda odio ducimus sunt et.
              </Paragraph>
            </Modal>
          </Modal.Context>
        </div>
      ))}
      {sizes.map((size) => (
        <Pagination key={size} aria-label='Sidenavigering' data-size={size}>
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
      ))}
      {sizes.map((size) => (
        <div key={size} data-size={size}>
          <Popover.Context>
            <Popover.Trigger>My popup</Popover.Trigger>
            <Popover>popover content</Popover>
          </Popover.Context>
        </div>
      ))}
      {sizes.map((size) => (
        <Table key={size} data-size={size}>
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
      ))}
      {sizes.map((size) => (
        <Tabs key={size} data-size={size} defaultValue='value1'>
          <Tabs.List>
            <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
            <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
            <Tabs.Tab value='value3'>Tab 3</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='value1'>content 1</Tabs.Panel>
          <Tabs.Panel value='value2'>content 2</Tabs.Panel>
          <Tabs.Panel value='value3'>content 3</Tabs.Panel>
        </Tabs>
      ))}
      {sizes.map((size) => (
        <Tag key={size} data-size={size}>
          Tag
        </Tag>
      ))}
      {sizes.map((size) => (
        <ToggleGroup key={size} data-size={size} defaultValue='innboks'>
          <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
          <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
          <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
        </ToggleGroup>
      ))}
      {sizes.map((size) => (
        <div key={size} data-size={size}>
          <Tooltip content='Tooltip text'>
            <Button>My tooltip</Button>
          </Tooltip>
        </div>
      ))}
    </div>
  );
};
