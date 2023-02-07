import React, { useEffect } from 'react';
import tokens from '@altinn/figma-design-tokens/dist/tokens';

import { Table } from '../Table';
import {
  TableCellColor,
  TableCellFont,
  TableCellSpace,
} from '../TableCells/TableCells';

interface TokenTableProps {
  jsonKey: string;
  componentName: string;
  showPreview: boolean;
  description?: boolean;
}

const TokensTable = (tokenTable: TokenTableProps) => {
  useEffect(() => {
    getRows();
  });

  const getPreview = (key: string, value: string) => {
    if (key.includes('color')) {
      return <TableCellColor color={value} />;
    } else if (key.includes('font_size')) {
      return <TableCellFont size={value} />;
    } else {
      return <TableCellSpace size={value} />;
    }
  };

  const getHeadings = () => {
    if (tokenTable.showPreview) {
      return ['Navn', 'Verdi', 'Forhåndsvisning'];
    } else {
      return ['Navn', 'Verdi'];
    }
  };

  const getRows = () => {
    const row = flattenObject(
      getJsonByKey(tokenTable.jsonKey, tokens),
      '--' + tokenTable.componentName + '-',
    );

    const rows: { row: unknown[] }[] = [];

    Object.entries(row).map(([key, value]) => {
      if (tokenTable.showPreview) {
        rows.push({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          row: [key, value, getPreview(key, value)],
        });
      } else {
        rows.push({
          row: [key, value],
        });
      }
    });
    return rows;
  };

  const getJsonByKey = (path: string, json: any) => {
    const parts = path.split('.');
    return parts.reduce((obj, part) => obj[part], json);
  };

  const flattenObject = (jsonObject = {}, prefix = '', result = {}) => {
    for (const key in jsonObject) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (typeof jsonObject[key] !== 'object') {
        if (key !== 'type' && key !== 'description') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          result[prefix.slice(0, -1)] = jsonObject[key];
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        flattenObject(jsonObject[key], `${prefix}${key}-`, result);
      }
    }
    return result;
  };

  if (!getRows().length && tokenTable.description) {
    return <p>Det finnes ingen spesifikke variabler for denne komponenten.</p>;
  }

  return (
    <>
      {tokenTable.description && (
        <p>
          Komponenten har følgende CSS-variabler tilgjengelig som kan overstyres
          ved behov:
        </p>
      )}
      <Table
        headings={getHeadings()}
        rows={getRows()}
      />
    </>
  );
};

export { TokensTable };
