import type { Meta, StoryFn } from '@storybook/react';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';

import { Checkbox } from '../form/Checkbox';
import { Textfield } from '../form/Textfield';

import type { TableHeaderCellProps } from './TableHeaderCell';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '.';
import { Label } from '../Label';

type Story = StoryFn<typeof Table>;

export default {
  title: 'Komponenter/Table',
  component: Table,
} as Meta;

export const Preview: Story = (args) => {
  return (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Header 1</TableHeaderCell>
          <TableHeaderCell>Header 2</TableHeaderCell>
          <TableHeaderCell>Header 3</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Cell 1</TableCell>
          <TableCell>Cell 2</TableCell>
          <TableCell>Cell 3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Cell 4</TableCell>
          <TableCell>Cell 5</TableCell>
          <TableCell>Cell 6</TableCell>
        </TableRow>
      </TableBody>
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
      <TableHead>
        <TableRow>
          <TableHeaderCell
            sort={sortField === 'navn' ? sortDirection : 'none'}
            onClick={() => handleSort('navn')}
          >
            Navn
          </TableHeaderCell>
          <TableHeaderCell>Epost</TableHeaderCell>
          <TableHeaderCell
            sort={sortField === 'telefon' ? sortDirection : 'none'}
            onClick={() => handleSort('telefon')}
          >
            Telefon
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedData.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.navn}</TableCell>
            <TableCell>{row.epost}</TableCell>
            <TableCell>{row.telefon}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const StickyHeader: Story = (args) => {
  const rows = Array.from({ length: 50 }, (_, i) => i + 1);
  return (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Header 1</TableHeaderCell>
          <TableHeaderCell>Header 2</TableHeaderCell>
          <TableHeaderCell>Header 3</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row}>
            <TableCell>{`Cell ${row}1`}</TableCell>
            <TableCell>{`Cell ${row}2`}</TableCell>
            <TableCell>{`Cell ${row}3`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
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
      <TableHead>
        <TableRow>
          <TableHeaderCell>
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
          </TableHeaderCell>
          <TableHeaderCell>Header 1</TableHeaderCell>
          <TableHeaderCell>Header 2</TableHeaderCell>
          <TableHeaderCell>Header 3</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row}>
            <TableCell>
              <Checkbox
                aria-label={`Checkbox ${row}`}
                checked={!!checkedItems[row]}
                value={row.toString()}
                onChange={(event) => handleCheckboxChange(event, row)}
                size='sm'
              />
            </TableCell>
            <TableCell>1</TableCell>
            <TableCell>2</TableCell>
            <TableCell>
              <Textfield size='sm' aria-label={`Textfield ${row}`} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
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
      <TableHead>
        <TableRow>
          <TableHeaderCell>Header 1</TableHeaderCell>
          <TableHeaderCell>Header 2</TableHeaderCell>
          <TableHeaderCell>Header 3</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row}>
            <TableCell>{`Cell ${row}1`}</TableCell>
            <TableCell>{`Cell ${row}2`}</TableCell>
            <TableCell>{`Cell ${row}3`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const MultipleHeaderRows: Story = (args) => {
  const rows = Array.from({ length: 50 }, (_, i) => i + 1);
  return (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Header 1</TableHeaderCell>
          <TableHeaderCell colSpan={2}>Header 2</TableHeaderCell>
        </TableRow>
        <TableRow>
          <TableHeaderCell>Header 3</TableHeaderCell>
          <TableHeaderCell>Header 4</TableHeaderCell>
          <TableHeaderCell>Header 5</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row}>
            <TableCell>{`Cell ${row}1`}</TableCell>
            <TableCell>{`Cell ${row}2`}</TableCell>
            <TableCell>{`Cell ${row}3`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
