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

export const Preview: Story = () => {
  return (
    <Table>
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
        <TableRow>
          <TableCell>Cell 7</TableCell>
          <TableCell>Cell 8</TableCell>
          <TableCell>Cell 9</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
