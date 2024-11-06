import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export type DropdownListProps = HTMLAttributes<HTMLUListElement>;

export const DropdownList = forwardRef<HTMLUListElement, DropdownListProps>(
  function DropdownList({ className, ...rest }, ref) {
    return <ul ref={ref} {...rest} />;
  },
);
