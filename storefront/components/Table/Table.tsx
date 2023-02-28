import React from 'react';

import classes from './Table.module.css';

export interface TableProps {
  type?: string;
  headings: string[];
  rows: RowsProps[];
}

interface RowsProps {
  row: any;
}

const Table = (tableProps: TableProps) => {
  return (
    <table className={classes['ddsdocs-table']}>
      <thead className={classes['ddsdocs-table__header']}>
        <tr className={classes['ddsdocs-table__row']}>
          {tableProps.headings.map((value, key) => (
            <th
              className={classes['ddsdocs-table__header-cell']}
              key={key}
            >
              {value}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableProps.rows.map((value, key) => (
          <tr
            key={key}
            className={classes['ddsdocs-table__row']}
          >
            {value.row.map((rowValue: any, rowKey: any) => (
              <td
                key={rowKey}
                className={classes['ddsdocs-table__data-cell']}
              >
                {rowValue}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { Table };
