import { type HTMLAttributes, forwardRef } from 'react';

export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * TableHead component, used to display the header of a table. Renders a native HTML thead element.
 *
 * @example
 * <Table.Head>
 *   <Table.Row>
 *     <Table.HeaderCell>Name</Table.HeaderCell>
 *     <Table.HeaderCell>Age</Table.HeaderCell>
 *   </Table.Row>
 * </Table.Head>
 */
export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHead(rest, ref) {
    return <thead ref={ref} {...rest} />;
  },
);
