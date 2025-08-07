import { forwardRef, type HTMLAttributes } from 'react';

export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * TableHead component, used to display the header of a table. Renders a native HTML thead element.
 *
 * @example
 * <TableHead>
 *   <TableRow>
 *     <TableHeaderCell>Name</TableHeaderCell>
 *     <TableHeaderCell>Age</TableHeaderCell>
 *   </TableRow>
 * </TableHead>
 */
export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHead(rest, ref) {
    return <thead ref={ref} {...rest} />;
  },
);
