import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { TableHTMLAttributes } from 'react';
import type { DefaultProps } from '../../types';

export type TableProps = {
  /**
   * Will give the table zebra striping
   * @default false
   */
  zebra?: boolean;
  /**
   * Will make the table header sticky
   * @default false
   */
  stickyHeader?: boolean;
  /**
   * Will give the table a rounded border
   * @default false
   */
  border?: boolean;
  /**
   * Will give the table a hover effect on rows
   * @default false
   */
  hover?: boolean;
} & Omit<TableHTMLAttributes<HTMLTableElement>, 'border'> &
  DefaultProps;

/**
 * Table component, used to display tabular data. Renders a native HTML table element.
 *
 * @example
 * <Table>
 *   <Table.Head>
 *     <Table.Row>
 *       <Table.HeaderCell>Name</Table.HeaderCell>
 *       <Table.HeaderCell>Age</Table.HeaderCell>
 *     </Table.Row>
 *   </Table.Head>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>John</Table.Cell>
 *       <Table.Cell>25</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 *   <Table.Foot>
 *     <Table.Row>
 *       <Table.Cell>Total</Table.Cell>
 *       <Table.Cell>2</Table.Cell>
 *     </Table.Row>
 *   </Table.Foot>
 * </Table>
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    zebra = false,
    stickyHeader = false,
    border = false,
    hover = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <table
      className={cl('ds-table', className)}
      data-border={border || undefined}
      data-hover={hover || undefined}
      data-sticky-header={stickyHeader || undefined}
      data-zebra={zebra || undefined}
      ref={ref}
      {...rest}
    >
      {children}
    </table>
  );
});
