import { forwardRef, type HTMLAttributes } from 'react';

export type DropdownItemProps = HTMLAttributes<HTMLLIElement>;

/**
 * DropdownItem component, used to display an item in the Dropdown. Used within a DropdownList.
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
export const DropdownItem = forwardRef<HTMLLIElement, DropdownItemProps>(
  function DropdownItem({ className, ...rest }, ref) {
    return <li ref={ref} {...rest} />;
  },
);
