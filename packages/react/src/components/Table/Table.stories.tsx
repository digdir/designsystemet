import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import type { TableHeaderCellProps } from './TableHeaderCell';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '.';

type Story = StoryFn<typeof Table>;

export default {
  title: 'Felles/Table',
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
  size: 'medium',
  zebra: false,
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
            sortable
            sort={sortField === 'navn' ? sortDirection : undefined}
            onClick={() => handleSort('navn')}
          >
            Navn
          </TableHeaderCell>
          <TableHeaderCell
            sortable
            sort={sortField === 'epost' ? sortDirection : undefined}
            onClick={() => handleSort('epost')}
          >
            Epost
          </TableHeaderCell>
          <TableHeaderCell
            sortable
            sort={sortField === 'telefon' ? sortDirection : undefined}
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
