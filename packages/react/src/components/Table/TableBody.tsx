import * as React from 'react';

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ children, ...rest }, ref) => {
  return (
    <tbody
      ref={ref}
      {...rest}
    >
      {children}
    </tbody>
  );
});

TableBody.displayName = 'TableBody';
