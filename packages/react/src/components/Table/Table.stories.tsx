import type { Meta, StoryFn } from '@storybook/react';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';

import type { TableHeaderCellProps } from './TableHeaderCell';

import { Checkbox, Label, Table, Textfield } from '../..';

type Story = StoryFn<typeof Table>;

export default {
  title: 'Komponenter/Table',
  component: Table,
} as Meta;

export const Preview: Story = (args) => {
  return (
    <Table {...args}>
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
  );
};

Preview.args = {
  size: 'md',
  zebra: false,
  stickyHeader: false,
  border: false,
  hover: false,
};

const dummyData = [
  {
    id: 1,
    navn: 'Lise Nordmann',
    epost: 'lise@nordmann.no',
    telefon: '22345678',
  },
  {
    id: 2,
    navn: 'Kari Nordmann',
    epost: 'kari@nordmann.no',
    telefon: '87654321',
  },
  {
    id: 3,
    navn: 'Ola Nordmann',
    epost: 'ola@nordmann.no',
    telefon: '32345678',
  },
  {
    id: 4,
    navn: 'Per Nordmann',
    epost: 'per@nordmann.no',
    telefon: '12345678',
  },
];

export const Sortable: Story = (args) => {
  const [sortField, setSortField] = useState<
    keyof (typeof dummyData)[0] | null
  >(null);
  const [sortDirection, setSortDirection] =
    useState<TableHeaderCellProps['sort']>(undefined);

  const handleSort = (field: keyof (typeof dummyData)[0]) => {
    if (sortField === field && sortDirection === 'descending') {
      setSortField(null);
      setSortDirection(undefined);
    } else {
      setSortField(field);
      setSortDirection(
        sortField === field && sortDirection === 'ascending'
          ? 'descending'
          : 'ascending',
      );
    }
  };

  const sortedData = [...dummyData].sort((a, b) => {
    if (sortField === null) return 0;
    if (a[sortField] < b[sortField])
      return sortDirection === 'ascending' ? -1 : 1;
    if (a[sortField] > b[sortField])
      return sortDirection === 'ascending' ? 1 : -1;
    return 0;
  });

  return (
    <Table {...args}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell
            sort={sortField === 'navn' ? sortDirection : 'none'}
            onClick={() => handleSort('navn')}
          >
            Navn
          </Table.HeaderCell>
          <Table.HeaderCell>Epost</Table.HeaderCell>
          <Table.HeaderCell
            sort={sortField === 'telefon' ? sortDirection : 'none'}
            onClick={() => handleSort('telefon')}
          >
            Telefon
          </Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sortedData.map((row) => (
          <Table.Row key={row.id}>
            <Table.Cell>{row.navn}</Table.Cell>
            <Table.Cell>{row.epost}</Table.Cell>
            <Table.Cell>{row.telefon}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const StickyHeader: Story = (args) => {
  const rows = Array.from({ length: 50 }, (_, i) => i + 1);
  return (
    <Table {...args}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Header 1</Table.HeaderCell>
          <Table.HeaderCell>Header 2</Table.HeaderCell>
          <Table.HeaderCell>Header 3</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row}>
            <Table.Cell>{`Cell ${row}1`}</Table.Cell>
            <Table.Cell>{`Cell ${row}2`}</Table.Cell>
            <Table.Cell>{`Cell ${row}3`}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

StickyHeader.args = {
  stickyHeader: true,
  tabIndex: 0,
};

StickyHeader.parameters = {
  customStyles: { height: '280px', overflow: 'auto' },
};

type CheckedItems = {
  [key: number]: boolean;
};

export const WithFormElements: Story = (args) => {
  const rows = Array.from({ length: 3 }, (_, i) => i + 1);
  const [headerChecked, setHeaderChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({
    1: false,
    2: true,
    3: false,
  });

  const interderminate =
    Boolean(Object.values(checkedItems).find((item) => item)) && !headerChecked;

  useEffect(() => {
    const allChecked = Object.values(checkedItems).every((item) => item);
    setHeaderChecked(allChecked);
  }, [checkedItems]);

  const handleHeaderCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHeaderChecked(event.target.checked);
    setCheckedItems(
      rows.reduce(
        (acc: CheckedItems, row) =>
          Object.assign(acc, { [row]: event.target.checked }),
        {},
      ),
    );
  };

  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    row: number,
  ) => {
    setCheckedItems({ ...checkedItems, [row]: event.target.checked });
  };

  return (
    <Table {...args}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>
            <Label style={{ display: 'flex', gap: '8px' }}>
              <Checkbox
                checked={headerChecked}
                onChange={handleHeaderCheckboxChange}
                indeterminate={interderminate}
                value='all'
                size='sm'
              />
              Selection
            </Label>
          </Table.HeaderCell>
          <Table.HeaderCell>Header 1</Table.HeaderCell>
          <Table.HeaderCell>Header 2</Table.HeaderCell>
          <Table.HeaderCell>Header 3</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row}>
            <Table.Cell>
              <Checkbox
                aria-label={`Checkbox ${row}`}
                checked={!!checkedItems[row]}
                value={row.toString()}
                onChange={(event) => handleCheckboxChange(event, row)}
                size='sm'
              />
            </Table.Cell>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>2</Table.Cell>
            <Table.Cell>
              <Textfield size='sm' aria-label={`Textfield ${row}`} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const FixedTable: Story = (args) => {
  const rows = Array.from({ length: 3 }, (_, i) => i + 1);
  return (
    <Table
      {...args}
      style={{
        tableLayout: 'fixed',
      }}
    >
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Header 1</Table.HeaderCell>
          <Table.HeaderCell>Header 2</Table.HeaderCell>
          <Table.HeaderCell>Header 3</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row}>
            <Table.Cell>{`Cell ${row}1`}</Table.Cell>
            <Table.Cell>{`Cell ${row}2`}</Table.Cell>
            <Table.Cell>{`Cell ${row}3`}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const MultipleHeaderRows: Story = (args) => {
  const rows = Array.from({ length: 50 }, (_, i) => i + 1);
  return (
    <Table {...args}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Header 1</Table.HeaderCell>
          <Table.HeaderCell colSpan={2}>Header 2</Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell>Header 3</Table.HeaderCell>
          <Table.HeaderCell>Header 4</Table.HeaderCell>
          <Table.HeaderCell>Header 5</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row}>
            <Table.Cell>{`Cell ${row}1`}</Table.Cell>
            <Table.Cell>{`Cell ${row}2`}</Table.Cell>
            <Table.Cell>{`Cell ${row}3`}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
