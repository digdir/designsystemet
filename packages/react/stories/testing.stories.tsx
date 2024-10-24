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
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2rem',
        maxWidth: '90vw',
      }}
    >
      <div>14px</div>
      <div>16px</div>
      <div>18px</div>
      <div>24px</div>
      <Accordion data-data-size='xs'>
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
      <Accordion data-data-size='sm'>
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
      <Accordion data-data-size='md'>
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
      <Accordion data-data-size='xl'>
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
      <Alert data-data-size='xs'>Dette er en alert</Alert>
      <Alert data-size='sm'>Dette er en alert</Alert>
      <Alert data-size='md'>Dette er en alert</Alert>
      <Alert data-data-size='xl'>Dette er en alert</Alert>
      <div>
        <Avatar data-size='xs' aria-label='Jan Daniel'>
          JD
        </Avatar>
      </div>
      <div>
        <Avatar data-size='sm' aria-label='Jan Daniel'>
          JD
        </Avatar>
      </div>
      <div>
        <Avatar data-size='md' aria-label='Jan Daniel'>
          JD
        </Avatar>
      </div>
      <div>
        <Avatar data-data-size='xl' aria-label='Jan Daniel'>
          JD
        </Avatar>
      </div>
      <Badge data-data-size='xs' count={99} maxCount={10} />
      <Badge data-size='sm' count={99} maxCount={10} />
      <Badge data-size='md' count={99} maxCount={10} />
      <Badge data-data-size='xl' count={99} maxCount={10} />
      <Breadcrumbs data-data-size='xs'>
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
      <Breadcrumbs data-size='sm'>
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
      <Breadcrumbs data-size='md'>
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
      <Breadcrumbs data-data-size='xl'>
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
        <Button data-data-size='xs'>
          <PrinterSmallIcon />
          Klikk her
        </Button>
      </div>
      <div>
        <Button data-size='sm'>
          <PrinterSmallIcon />
          Klikk her
        </Button>
      </div>
      <div>
        <Button data-size='md'>
          <PrinterSmallIcon /> Klikk her
        </Button>
      </div>
      <div>
        <Button data-data-size='xl'>
          <PrinterSmallIcon /> Klikk her
        </Button>
      </div>
      <Card data-data-size='xs'>
        <Heading>Card Neutral</Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
      <Card data-data-size='sm'>
        <Heading>Card Neutral</Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
      <Card data-data-size='md'>
        <Heading>Card Neutral</Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
      <Card data-data-size='xl'>
        <Heading>Card Neutral</Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
      <div
        style={{ display: 'flex', gap: 'var(--ds-sizing-2)' }}
        data-data-size='xs'
      >
        <Chip.Radio>Radio</Chip.Radio>
        <Chip.Checkbox>Check</Chip.Checkbox>
        <Chip.Button>Knapp</Chip.Button>
      </div>
      <div
        style={{ display: 'flex', gap: 'var(--ds-sizing-2)' }}
        data-data-size='sm'
      >
        <Chip.Radio>Radio</Chip.Radio>
        <Chip.Checkbox>Check</Chip.Checkbox>
        <Chip.Button>Knapp</Chip.Button>
      </div>
      <div
        style={{ display: 'flex', gap: 'var(--ds-sizing-2)' }}
        data-data-size='md'
      >
        <Chip.Radio>Radio</Chip.Radio>
        <Chip.Checkbox>Check</Chip.Checkbox>
        <Chip.Button>Knapp</Chip.Button>
      </div>
      <div
        style={{ display: 'flex', gap: 'var(--ds-sizing-2)' }}
        data-data-size='xl'
      >
        <Chip.Radio>Radio</Chip.Radio>
        <Chip.Checkbox>Check</Chip.Checkbox>
        <Chip.Button>Knapp</Chip.Button>
      </div>
      <div data-data-size='xs'>
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
      <div data-data-size='sm'>
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
      <div data-data-size='md'>
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
      <div data-data-size='xl'>
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
      <ErrorSummary data-data-size='xs'>
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
      <ErrorSummary data-size='sm'>
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
      <ErrorSummary data-size='md'>
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
      <ErrorSummary data-data-size='xl'>
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
        {/* TMP fix */}
        {`
          .ds-field { display: block }
          .ds-field input+label { margin: 0; font-weight: normal }
        `}
      </style>
      <Field data-data-size='xs'>
        <Label>Text</Label>
        <Input aria-invalid='true' defaultValue='Noe tekst' />
        <ValidationMessage>En feil</ValidationMessage>
      </Field>
      <Field data-data-size='sm'>
        <Label>Text</Label>
        <Input aria-invalid='true' defaultValue='Noe tekst' />
        <ValidationMessage>En feil</ValidationMessage>
      </Field>
      <Field data-data-size='md'>
        <Label>Text</Label>
        <Input aria-invalid='true' defaultValue='Noe tekst' />
        <ValidationMessage>En feil</ValidationMessage>
      </Field>
      <Field data-data-size='xl'>
        <Label>Text</Label>
        <Input aria-invalid='true' defaultValue='Noe tekst' />
        <ValidationMessage>En feil</ValidationMessage>
      </Field>
      <Field
        data-data-size='xs'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='radio' name='my-radio' defaultChecked />
        <Label>Text</Label>
      </Field>
      <Field
        data-data-size='sm'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='radio' name='my-radio' defaultChecked />
        <Label>Text</Label>
      </Field>
      <Field
        data-data-size='md'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='radio' name='my-radio' />
        <Label>Text</Label>
      </Field>
      <Field
        data-data-size='xl'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='radio' name='my-radio' />
        <Label>Text</Label>
      </Field>
      <Field
        data-data-size='xs'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='checkbox' name='my-check' defaultChecked />
        <Label>Text</Label>
      </Field>
      <Field
        data-data-size='sm'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='checkbox' name='my-check' defaultChecked />
        <Label>Text</Label>
      </Field>
      <Field
        data-data-size='md'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='checkbox' name='my-check' />
        <Label>Text</Label>
      </Field>
      <Field
        data-data-size='xl'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='checkbox' name='my-check' />
        <Label>Text</Label>
      </Field>
      <Field
        data-data-size='xs'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='checkbox' name='my-switch' role='switch' defaultChecked />
        <Label>Text</Label>
      </Field>
      <Field
        data-data-size='sm'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='checkbox' name='my-switch' role='switch' defaultChecked />
        <Label>Text</Label>
      </Field>
      <Field
        data-data-size='md'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='checkbox' name='my-switch' role='switch' />
        <Label>Text</Label>
      </Field>
      <Field
        data-data-size='xl'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-sizing-2)',
        }}
      >
        <Input type='checkbox' name='my-switch' role='switch' />
        <Label>Text</Label>
      </Field>
      <HelpText data-data-size='xs' aria-label='Mer info'>
        Mer tekst
      </HelpText>
      <HelpText data-size='sm' aria-label='Mer info'>
        Mer tekst
      </HelpText>
      <HelpText data-size='md' aria-label='Mer info'>
        Mer tekst
      </HelpText>
      <HelpText data-data-size='xl' aria-label='Mer info'>
        Mer tekst
      </HelpText>
      <div data-data-size='xs'>
        <Link href='#'>Lenke</Link>
      </div>
      <div data-data-size='sm'>
        <Link href='#'>Lenke</Link>
      </div>
      <div data-data-size='md'>
        <Link href='#'>Lenke</Link>
      </div>
      <div data-data-size='xl'>
        <Link href='#'>Lenke</Link>
      </div>
      <List.Unordered data-data-size='xs'>
        <List.Item>List Item 1</List.Item>
        <List.Item>List Item 2</List.Item>
        <List.Item>List Item 3</List.Item>
      </List.Unordered>
      <List.Unordered data-size='sm'>
        <List.Item>List Item 1</List.Item>
        <List.Item>List Item 2</List.Item>
        <List.Item>List Item 3</List.Item>
      </List.Unordered>
      <List.Unordered data-size='md'>
        <List.Item>List Item 1</List.Item>
        <List.Item>List Item 2</List.Item>
        <List.Item>List Item 3</List.Item>
      </List.Unordered>
      <List.Unordered data-data-size='xl'>
        <List.Item>List Item 1</List.Item>
        <List.Item>List Item 2</List.Item>
        <List.Item>List Item 3</List.Item>
      </List.Unordered>
      <Spinner data-size='xs' title='Loading' />
      <Spinner data-size='sm' title='Loading' />
      <Spinner data-size='md' title='Loading' />
      <Spinner data-size='xl' title='Loading' />
      <div data-data-size='xs'>
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
      <div data-data-size='sm'>
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
      <div data-data-size='md'>
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
      <div data-data-size='xl'>
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
      <Pagination aria-label='Sidenavigering' data-data-size='xs'>
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
      <Pagination aria-label='Sidenavigering' data-size='sm'>
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
      <Pagination aria-label='Sidenavigering' data-size='md'>
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
      <Pagination aria-label='Sidenavigering' data-data-size='xl'>
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
      <div data-data-size='xs'>
        <Popover.Context>
          <Popover.Trigger>My popup</Popover.Trigger>
          <Popover>popover content</Popover>
        </Popover.Context>
      </div>
      <div data-data-size='sm'>
        <Popover.Context>
          <Popover.Trigger>My popup</Popover.Trigger>
          <Popover>popover content</Popover>
        </Popover.Context>
      </div>
      <div data-data-size='md'>
        <Popover.Context>
          <Popover.Trigger>My popup</Popover.Trigger>
          <Popover>popover content</Popover>
        </Popover.Context>
      </div>
      <div data-data-size='xl'>
        <Popover.Context>
          <Popover.Trigger>My popup</Popover.Trigger>
          <Popover>popover content</Popover>
        </Popover.Context>
      </div>
      <Table data-data-size='xs'>
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
      <Table data-size='sm'>
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
      <Table data-size='md'>
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
      <Table data-data-size='xl'>
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
      <Tabs data-data-size='xs' defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
          <Tabs.Tab value='value3'>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
        <Tabs.Panel value='value3'>content 3</Tabs.Panel>
      </Tabs>
      <Tabs data-size='sm' defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
          <Tabs.Tab value='value3'>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
        <Tabs.Panel value='value3'>content 3</Tabs.Panel>
      </Tabs>
      <Tabs data-size='md' defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
          <Tabs.Tab value='value3'>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
        <Tabs.Panel value='value3'>content 3</Tabs.Panel>
      </Tabs>
      <Tabs data-data-size='xl' defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
          <Tabs.Tab value='value3'>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
        <Tabs.Panel value='value3'>content 3</Tabs.Panel>
      </Tabs>
      <Tag data-data-size='xs'>Tag</Tag>
      <Tag data-size='sm'>Tag</Tag>
      <Tag data-size='md'>Tag</Tag>
      <Tag data-data-size='xl'>Tag</Tag>
      <ToggleGroup data-data-size='xs' defaultValue='innboks'>
        <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
        <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
        <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup data-size='sm' defaultValue='innboks'>
        <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
        <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
        <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup data-size='md' defaultValue='innboks'>
        <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
        <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
        <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup data-data-size='xl' defaultValue='innboks'>
        <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
        <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
        <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      </ToggleGroup>
      <div data-data-size='xs'>
        <Tooltip content='Tooltip text'>
          <Button>My tooltip</Button>
        </Tooltip>
      </div>
      <div data-data-size='sm'>
        <Tooltip content='Tooltip text'>
          <Button>My tooltip</Button>
        </Tooltip>
      </div>
      <div data-data-size='md'>
        <Tooltip content='Tooltip text'>
          <Button>My tooltip</Button>
        </Tooltip>
      </div>
      <div data-data-size='xl'>
        <Tooltip content='Tooltip text'>
          <Button>My tooltip</Button>
        </Tooltip>
      </div>
    </div>
  );
};
