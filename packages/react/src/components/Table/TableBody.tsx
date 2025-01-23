import { type HTMLAttributes, forwardRef } from 'react';

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * TableBody component, used to display the body of a table. Renders a native HTML tbody element.
 *
 * @example
 * <Table.Body>
 *   <Table.Row>
 *     <Table.Cell>John</Table.Cell>
 *     <Table.Cell>25</Table.Cell>
 *   </Table.Row>
 * </Table.Body>
 */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody(rest, ref) {
    return <tbody ref={ref} {...rest} />;
  },
);
