import preview from '../../../../../../apps/storybook/.storybook/preview';
import {
  Checkbox,
  Fieldset,
  Table,
  ValidationMessage,
} from '../../../components';
import {
  type UseCheckboxGroupProps,
  useCheckboxGroup,
} from './use-checkbox-group';

const UseCheckboxGroup = (_props: UseCheckboxGroupProps) => (
  <Checkbox aria-label='label' />
);

const meta = preview.meta({
  title: 'Utilities/useCheckboxGroup',
  parameters: { chromatic: { disableSnapshot: true } },
  component: UseCheckboxGroup,
});

export const Default = meta.story({
  render: (args) => {
    const { getCheckboxProps, validationMessageProps } = useCheckboxGroup({
      value: ['epost'],
      ...(args as UseCheckboxGroupProps),
    });

    return (
      <Fieldset>
        <Checkbox label='E-post' {...getCheckboxProps('epost')} />
        <Checkbox label='Telefon' {...getCheckboxProps('telefon')} />
        <Checkbox label='SMS' {...getCheckboxProps('sms')} />
        <ValidationMessage {...validationMessageProps} />
      </Fieldset>
    );
  },
});

export const AllowIndeterminate = meta.story({
  render: (args) => {
    const { getCheckboxProps } = useCheckboxGroup({
      name: 'my-checkbox',
      ...(args as UseCheckboxGroupProps),
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
  },
});
