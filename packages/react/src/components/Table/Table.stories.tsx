import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

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
  return (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeaderCell sortable>Navn</TableHeaderCell>
          <TableHeaderCell sortable>Epost</TableHeaderCell>
          <TableHeaderCell
            sortable
            sort='descending'
          >
            Telefon
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dummyData.map((row) => (
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
