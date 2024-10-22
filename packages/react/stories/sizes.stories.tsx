import { PrinterSmallIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';

import {
  Accordion,
  Alert,
  Avatar,
  Button,
  Card,
  Checkbox,
  Combobox,
  Divider,
  Heading,
  Link,
  Pagination,
  Paragraph,
  Radio,
  Search,
  Select,
  Switch,
  Table,
  Tabs,
  Tag,
  Textfield,
  ToggleGroup,
  Tooltip,
} from '../src';

export default {
  title: 'Sizes',
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Sizes: StoryFn = () => (
  <div
    style={{
      display: 'grid',
      alignItems: 'start',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
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
          stiftelser og aksjeselskap som kan registreres. Virksomheten kan ikke
          dele ut midler til fysiske personer. Virksomheten må ha et styre.
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
          stiftelser og aksjeselskap som kan registreres. Virksomheten kan ikke
          dele ut midler til fysiske personer. Virksomheten må ha et styre.
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
          stiftelser og aksjeselskap som kan registreres. Virksomheten kan ikke
          dele ut midler til fysiske personer. Virksomheten må ha et styre.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
    <Alert size='sm'>Dette er en alert</Alert>
    <Alert size='md'>Dette er en alert</Alert>
    <Alert size='lg'>Dette er en alert</Alert>
    <Avatar size='xs' aria-label='Jan Daniel'>
      JD
    </Avatar>
    <Avatar size='sm' aria-label='Jan Daniel'>
      JD
    </Avatar>
    <Avatar size='md' aria-label='Jan Daniel'>
      JD
    </Avatar>
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
  </div>
);
