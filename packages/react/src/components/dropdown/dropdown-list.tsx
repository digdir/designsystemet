import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type DropdownListProps = HTMLAttributes<HTMLUListElement>;

/**
 * DropdownList component, used to display a list of items in the Dropdown.
 *
 * @example
 * <Dropdown>
 *  <DropdownList>
 *    <DropdownItem>
 *      <DropdownButton>Button</DropdownButton>
 *    </DropdownItem>
 *  </DropdownList>
 * </Dropdown>
 */
export const DropdownList = forwardRef<HTMLUListElement, DropdownListProps>(
  function DropdownList({ className, ...rest }, ref) {
    return <ul ref={ref} {...rest} />;
  },
);
