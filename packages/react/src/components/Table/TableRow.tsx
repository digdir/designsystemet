import { type HTMLAttributes, forwardRef } from 'react';

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

/**
 * TableRow component, used to display the rows of a table. Renders a native HTML tr element.
 *
 * @example
 * <Table.Row>
 *   <Table.Cell>John</Table.Cell>
 *   <Table.Cell>25</Table.Cell>
 * </Table.Row>
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(rest, ref) {
    return <tr ref={ref} {...rest} />;
  },
);
