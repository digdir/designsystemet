import { type HTMLAttributes, forwardRef } from 'react';

export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHead(rest, ref) {
    return <thead ref={ref} {...rest} />;
  },
);
