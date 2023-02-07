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
          key={1}
        />,
        'Teksten til headeren.',
        <TableCellTag
          type='undefined'
          text='"Heading"'
          key={1}
        />,
      ],
    });
    arr.push({
      row: [
        'level?',
        <TableCellTag
          type='number'
          text='HeadingLevel'
          key={1}
        />,
        'Level på heading taggen, fra 1-6.',
        <TableCellTag
          type='undefined'
          text='1'
          key={1}
        />,
      ],
    });
    arr.push({
      row: [
        'size?',
        <TableCellTag
          type='number'
          text='HeadingSize'
          key={1}
        />,
        'Størrelsen på teksten',
        <TableCellTag
          type='undefined'
          text='900'
          key={1}
        />,
      ],
    });
    arr.push({
      row: [
        'margin?',
        <TableCellTag
          type='boolean'
          text='boolean'
          key={1}
        />,
        'Margin bottom under komponenten fra 18-30px basert på størrelse.',
        <TableCellTag
          type='undefined'
          text='false'
          key={1}
        />,
      ],
    });
    arr.push({
      row: [
        'color?',
        <TableCellTag
          type='string'
          text='string'
          key={1}
        />,
        'Tekstfargen.',
        <TableCellTag
          type='undefined'
          text='#022f51'
          key={1}
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
