import React, { useEffect } from 'react';
import tokens from '@altinn/figma-design-tokens/dist/tokens';

import { Table } from '../Table';

interface TokenTableProps {
  jsonKey: string;
  componentName: string;
}

const TokenTable = (tokenTable: TokenTableProps) => {
  useEffect(() => {
    getRows();
  });

  const getRows = () => {
    let a = flattenObject(
      getJsonByKey(tokenTable.jsonKey, tokens),
      tokenTable.componentName + '-',
    );

    let rows = [];

    Object.entries(a).map(([key, value]) => {
      rows.push({ row: [key, value] });
    });
    return rows;
  };

  const getJsonByKey = (path: string, json: any) => {
    const parts = path.split('.');
    return parts.reduce((obj, part) => obj[part], json);
  };

  const flattenObject = (jsonObject = {}, prefix = '', result = {}) => {
    for (const key in jsonObject) {
      console.log(key);
      if (typeof jsonObject[key] !== 'object') {
        result[prefix + key] = jsonObject[key];
      } else {
        flattenObject(jsonObject[key], `${prefix}${key}-`, result);
      }
    }
    return result;
  };

  return (
    <Table
      headings={['Navn', 'Verdi']}
      rows={getRows()}
      // rows={[{ row: ['3', 'r', '5'] }, { row: ['f', '6', '8'] }]}
    />
  );
};

export { TokenTable };
