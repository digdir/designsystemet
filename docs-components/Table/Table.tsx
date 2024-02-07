/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO This will be removed so disabling stuff for now to save work
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
      <thead>
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
