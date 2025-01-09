import type { Meta, StoryFn } from '@storybook/react';
import {
  Checkbox,
  Fieldset,
  Table,
  ValidationMessage,
} from '../../../components';
import {
  type UseCheckboxGroupProps,
  useCheckboxGroup,
} from './useCheckboxGroup';

const meta: Meta = {
  title: 'Utilities/useCheckboxGroup',
  parameters: { chromatic: { disableSnapshot: true } },
  argTypes: {
    name: {
      table: { type: { summary: 'string' } },
      description:
        'Name of all checkboxes. If no name is passed, an auto-generated name will be created.',
    },
    value: {
      description: 'Array of values of selected checkboxes',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string[]' },
      },
    },
    onChange: {
      description: 'Callback when selected checkboxes changes',
      table: {
        type: {
          summary:
            '(nextValue: string[], prevValue: string[], event: ChangeEvent<HTMLInputElement>) => void;',
        },
      },
    },
    error: {
      table: { type: { summary: 'string | ReactNode' } },
      description: 'Shared error message for all checkboxes.',
    },
    disabled: {
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      description: 'Set disabled state of all checkboxes',
    },
    readOnly: {
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      description: 'Set read only state of all checkboxes',
    },
    required: {
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      description: 'Set required state of all checkboxes',
    },
  },
};

export default meta;

export const Default: StoryFn<UseCheckboxGroupProps> = (args) => {
  const { getCheckboxProps, validationMessageProps } = useCheckboxGroup({
    value: ['epost'],
    ...args,
  });

  return (
    <Fieldset>
      <Checkbox label='E-post' {...getCheckboxProps('epost')} />
      <Checkbox label='Telefon' {...getCheckboxProps('telefon')} />
      <Checkbox label='SMS' {...getCheckboxProps('sms')} />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};

export const AllowIndeterminate: StoryFn<UseCheckboxGroupProps> = (args) => {
  const { getCheckboxProps } = useCheckboxGroup({
    name: 'my-checkbox',
    ...args,
  });
  return (
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
          <Table.HeaderCell>Header</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {[1, 2].map((row) => (
          <Table.Row key={row}>
            <Table.Cell>
              <Checkbox
                aria-label={`Check ${row}`}
                {...getCheckboxProps(`${row}`)}
              />
            </Table.Cell>
            <Table.Cell>Content</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
