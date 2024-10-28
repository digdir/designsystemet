import { type HTMLAttributes, forwardRef } from 'react';

export type DropdownItemProps = HTMLAttributes<HTMLLIElement>;

export const DropdownItem = forwardRef<HTMLLIElement, DropdownItemProps>(
  function DropdownItem({ className, ...rest }, ref) {
    return <li ref={ref} {...rest} />;
  },
);
