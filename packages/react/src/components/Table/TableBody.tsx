import { type HTMLAttributes, forwardRef } from 'react';

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody(rest, ref) {
    return <tbody ref={ref} {...rest} />;
  },
);
