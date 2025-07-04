import { FloppydiskIcon, PencilIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Button,
  Divider,
  Fieldset,
  Paragraph,
  Radio,
  ValidationMessage,
} from '../../../components';
import { type UseRadioGroupProps, useRadioGroup } from './use-radio-group';

export const Preview: StoryFn<UseRadioGroupProps> = (args) => {
  const { getRadioProps } = useRadioGroup({
    ...args,
  });

  return (
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
  );
};

export const UseRadioGroup = (_props: UseRadioGroupProps) => (
  <Radio aria-label='label' />
);

export default {
  title: 'Utilities/useRadioGroup',
  component: UseRadioGroup,
  argTypes: {
    name: {
      table: { type: { summary: 'string' } },
      description:
        'Name of all radios. If no name is passed, an auto-generated name will be created.',
    },
    value: {
      description: 'Value of selected radio',
      table: { defaultValue: { summary: '' }, type: { summary: 'string' } },
    },
    onChange: {
      description: 'Callback when selected radio changes',
      table: {
        type: {
          summary:
            '(nextValue: string, prevValue: string, event: Event) => void;',
        },
      },
    },
    error: {
      table: { type: { summary: 'string | ReactNode' } },
      description: 'Shared error message for all radios.',
    },
    disabled: {
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      description: 'Set disabled state of all radios',
    },
    readOnly: {
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      description: 'Set read only state of all radios',
    },
    required: {
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      description: 'Set required state of all radios',
    },
  },
} as Meta;

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

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Paragraph style={{ marginBlock: 'var(--ds-size-2)' }}>
        Du har valgt: {value}
      </Paragraph>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => setValue('flammen')}>Velg Flammen</Button>
        <Button onClick={() => setValue('snadder')}>Velg Snadder</Button>
      </div>
    </>
  );
};

export const Conditional: StoryFn<UseRadioGroupProps> = (args) => {
  const { getRadioProps, validationMessageProps, value } = useRadioGroup({
    name: 'kommunikasjonskanal',
    ...args,
  });
  const [open, setOpen] = useState(false);

  return (
    <>
      Din kommunikasjonskanal: {value}
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
            <Radio label='E-post' {...getRadioProps('epost')} />
            <Radio label='Telefon' {...getRadioProps('telefon')} />
            <Radio label='SMS' {...getRadioProps('sms')} />
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
