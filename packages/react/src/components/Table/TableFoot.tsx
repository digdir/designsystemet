import { type HTMLAttributes, forwardRef } from 'react';

export type TableFootProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * TableFoot component, used to display the footer of a table. Renders a native HTML tfoot element.
 *
 * @example
 * <Table.Foot>
 *   <Table.Row>
 *     <Table.Cell>Total</Table.Cell>
 *     <Table.Cell>2</Table.Cell>
 *   </Table.Row>
 * </Table.Foot>
 */
export const TableFoot = forwardRef<HTMLTableSectionElement, TableFootProps>(
  function TableFoot(rest, ref) {
    return <tfoot ref={ref} {...rest} />;
  },
);
