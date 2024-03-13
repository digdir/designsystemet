import * as tokens from '@altinn/figma-design-tokens';

import { useMediaQuery } from '../../../hooks';
import { LegacyRadioButton } from '../LegacyRadioButton';
import type { SortProps, SortDirection } from '../LegacyTable/utils';
import {
  LegacyTable,
  LegacyTableHeader,
  LegacyTableRow,
  LegacyTableCell,
  LegacyTableBody,
  LegacyTableFooter,
} from '../LegacyTable';
import classes from '../LegacyTable/TableCell.module.css';

export interface LegacyResponsiveTableConfig<T> {
  rows: T[];
  headers: { [Col in keyof T]: string | JSX.Element };
  showColumnsMobile?: (keyof T)[];
  /**
   * Custom per-cell rendering. All cells will render their content directly by default (assumed to be string, number
   * or some simple scalar type). If you need to override how each cell is rendered, you can supply a render function here.
   */
  renderCell?: { [K in keyof T]?: (cell: T[K]) => JSX.Element };
  /**
   * Column sort functionality. If you set this property, you need to specify which columns/headers are sortable,
   * the current state for which column is sorted (along with the direction) and a callback to handle sort changes.
   */
  columnSort?: {
    onSortChange: (props: SortProps & { column: keyof T }) => void;
    sortable: (keyof T)[];
    currentlySortedColumn: keyof T | undefined;
    currentDirection: SortDirection | undefined;
  };
  /**
   * Row selection functionality. If you set this property, you'll enable selecting individual rows. You have to
   * handle the selection state yourself, and re-render this component with a new selectedValue whenever it changes.
   */
  rowSelection?: {
    onSelectionChange: (row: T) => void;
    selectedValue: T | undefined;
  };
  /**
   * Renders some content into a footer row spanning all columns. Usually used for rendering
   * a Pagination component.
   */
  footer?: JSX.Element;
}

export interface LegacyResponsiveTableProps<T> {
  config: LegacyResponsiveTableConfig<T>;
}

export function LegacyResponsiveTable<T>({
  config,
}: LegacyResponsiveTableProps<T>) {
  const isMobile = useMediaQuery(`(max-width: ${tokens.BreakpointsSm})`);

  return isMobile ? (
    <MobileLegacyTable config={config} />
  ) : (
    <LaptopLegacyTable config={config} />
  );
}

function MobileLegacyTable<T>({ config }: LegacyResponsiveTableProps<T>) {
  const { rows, headers, showColumnsMobile, renderCell, rowSelection, footer } =
    config;

  const selectedRowJson = JSON.stringify(rowSelection?.selectedValue || null);
  const columns = Object.keys(headers) as (keyof T)[];
  const numColumns = rowSelection ? 2 : 1;

  return (
    <LegacyTable
      selectRows={!!rowSelection}
      onChange={({ selectedValue }) =>
        rowSelection?.onSelectionChange(selectedValue)
      }
      selectedValue={rowSelection?.selectedValue}
    >
      <LegacyTableBody>
        {rows.map((row) => {
          const value = JSON.stringify(row);
          return (
            <LegacyTableRow
              key={value}
              rowData={row}
            >
              {rowSelection && (
                <LegacyTableCell radiobutton={true}>
                  <LegacyRadioButton
                    name={value}
                    onChange={() => rowSelection.onSelectionChange(row)}
                    value={value}
                    checked={value === selectedRowJson}
                    label={value}
                    hideLabel={true}
                  />
                </LegacyTableCell>
              )}
              <LegacyTableCell
                key={`${value}-data`}
                style={{ padding: '0px' }}
              >
                {columns.map((column) => {
                  if (
                    showColumnsMobile &&
                    !showColumnsMobile.includes(column)
                  ) {
                    return;
                  }

                  const renderFunc = renderCell && renderCell[column];
                  const content = renderFunc
                    ? renderFunc(row[column])
                    : (row[column] as string);

                  return (
                    <>
                      <div className={classes.header}>{headers[column]}</div>
                      <div className={classes.property}>{content}</div>
                    </>
                  );
                })}
              </LegacyTableCell>
            </LegacyTableRow>
          );
        })}
      </LegacyTableBody>
      {footer && (
        <LegacyTableFooter>
          <LegacyTableRow>
            <LegacyTableCell colSpan={numColumns}>{footer}</LegacyTableCell>
          </LegacyTableRow>
        </LegacyTableFooter>
      )}
    </LegacyTable>
  );
}

function LaptopLegacyTable<T>({ config }: LegacyResponsiveTableProps<T>) {
  const { rows, headers, renderCell, columnSort, rowSelection, footer } =
    config;

  const selectedRowJson = JSON.stringify(rowSelection?.selectedValue || null);
  const columns = Object.keys(headers) as (keyof T)[];
  const numColumns = rowSelection
    ? Object.keys(headers).length + 1
    : Object.keys(headers).length;

  return (
    <LegacyTable
      selectRows={!!rowSelection}
      onChange={({ selectedValue }) =>
        rowSelection?.onSelectionChange(selectedValue)
      }
      selectedValue={rowSelection?.selectedValue}
    >
      <LegacyTableHeader>
        <LegacyTableRow>
          {rowSelection && (
            <LegacyTableCell radiobutton={true}></LegacyTableCell>
          )}
          {columns.map((column) => (
            <LegacyTableCell
              key={column as string}
              onChange={({ next, previous }) => {
                columnSort &&
                  columnSort.onSortChange({ column, next, previous });
              }}
              sortDirection={
                columnSort
                  ? columnSort.currentlySortedColumn === column
                    ? columnSort.currentDirection
                    : columnSort.sortable.includes(column)
                    ? 'notActive'
                    : 'notSortable'
                  : 'notSortable'
              }
            >
              {headers[column]}
            </LegacyTableCell>
          ))}
        </LegacyTableRow>
      </LegacyTableHeader>
      <LegacyTableBody>
        {rows.map((row) => {
          const value = JSON.stringify(row);
          return (
            <LegacyTableRow
              key={value}
              rowData={row}
            >
              {rowSelection && (
                <LegacyTableCell radiobutton={true}>
                  <LegacyRadioButton
                    name={value}
                    onChange={() => rowSelection.onSelectionChange(row)}
                    value={value}
                    checked={value === selectedRowJson}
                    label={value}
                    hideLabel={true}
                  ></LegacyRadioButton>
                </LegacyTableCell>
              )}
              {columns.map((column) => {
                const renderFunc = renderCell && renderCell[column];
                return (
                  <LegacyTableCell key={`${value}-${column as string}`}>
                    {renderFunc
                      ? renderFunc(row[column])
                      : (row[column] as string)}
                  </LegacyTableCell>
                );
              })}
            </LegacyTableRow>
          );
        })}
      </LegacyTableBody>
      {footer && (
        <LegacyTableFooter>
          <LegacyTableRow>
            <LegacyTableCell colSpan={numColumns}>{footer}</LegacyTableCell>
          </LegacyTableRow>
        </LegacyTableFooter>
      )}
    </LegacyTable>
  );
}
