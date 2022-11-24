import React, { useEffect } from 'react';
import tokens from '@altinn/figma-design-tokens/dist/tokens';

import { Table } from '../Table';
import { TableCellColor, TableCellSpace } from '../TableCells/TableCells';

interface TokenTableProps {
  jsonKey: string;
  componentName: string;
}

const TokenTable = (tokenTable: TokenTableProps) => {
  useEffect(() => {
    getRows();
  });

  const getRows = () => {
    const row = flattenObject(
      getJsonByKey(tokenTable.jsonKey, tokens),
      '$' + tokenTable.componentName + '-',
    );

    const rows: { row: unknown[] }[] = [];

    Object.entries(row).map(([key, value]) => {
      rows.push({
        row: [
          key,
          value,
          value.includes('#') ? (
            <TableCellColor color={value} />
          ) : (
            <TableCellSpace size={value} />
          ),
        ],
      });
    });
    return rows;
  };

  const getJsonByKey = (path: string, json: any) => {
    const parts = path.split('.');
    return parts.reduce((obj, part) => obj[part], json);
  };

  const flattenObject = (jsonObject = {}, prefix = '', result = {}) => {
    for (const key in jsonObject) {
      if (typeof jsonObject[key] !== 'object') {
        if (key !== 'type') {
          result[prefix.slice(0, -1)] = jsonObject[key];
        }
      } else {
        flattenObject(jsonObject[key], `${prefix}${key}-`, result);
      }
    }
    return result;
  };

  const tomato = () => {};

  return (
    <Table
      headings={['Navn', 'Verdi', 'Preview']}
      rows={getRows()}
    />
  );
};

export { TokenTable };
