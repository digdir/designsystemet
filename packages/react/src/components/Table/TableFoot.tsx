import { type HTMLAttributes, forwardRef } from 'react';

export type TableFootProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableFoot = forwardRef<HTMLTableSectionElement, TableFootProps>(
  function TableFoot(rest, ref) {
    return <tfoot ref={ref} {...rest} />;
  },
);
