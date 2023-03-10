import React from 'react';

import { Table } from '../Table';
import { TableCellTag } from '../TableCells/TableCells';

const PropsTable = () => {
  const getRows = () => {
    const arr = [];

    arr.push({
      row: [
        'text',
        <TableCellTag
          type='string'
          text='string'
        />,
        'Teksten til headeren.',
        <TableCellTag
          type='undefined'
          text='"Heading"'
        />,
      ],
    });
    arr.push({
      row: [
        'level?',
        <TableCellTag
          type='number'
          text='HeadingLevel'
        />,
        'Level på heading taggen, fra 1-6.',
        <TableCellTag
          type='undefined'
          text='1'
        />,
      ],
    });
    arr.push({
      row: [
        'size?',
        <TableCellTag
          type='number'
          text='HeadingSize'
        />,
        'Størrelsen på teksten',
        <TableCellTag
          type='undefined'
          text='900'
        />,
      ],
    });
    arr.push({
      row: [
        'margin?',
        <TableCellTag
          type='boolean'
          text='boolean'
        />,
        'Margin bottom under komponenten fra 18-30px basert på størrelse.',
        <TableCellTag
          type='undefined'
          text='false'
        />,
      ],
    });
    arr.push({
      row: [
        'color?',
        <TableCellTag
          type='string'
          text='string'
        />,
        'Tekstfargen.',
        <TableCellTag
          type='undefined'
          text='#022f51'
        />,
      ],
    });

    return arr;
  };

  return (
    <Table
      headings={['Navn', 'Type', 'Beskrivelse', 'Default']}
      rows={getRows()}
    />
  );
};

export { PropsTable };
