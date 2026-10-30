import type { ReactNode } from 'react';
import { PopoverTriggerContext } from '../popover/popover-trigger-context';

export type DropdownTriggerContextProps = {
  children: ReactNode;
};

/**
 * DropdownTriggerContext enables use of the `.Trigger` for the Dropdown component.
 *
 * @deprecated Will be removed in the next major version. Connect a `Button` to the dropdown with `popovertarget` set to the dropdown's `id` instead.
 *
 * @example
 * <DropdownTriggerContext>
 *  <DropdownTrigger>Dropdown</DropdownTrigger>
 *  <Dropdown>
 *   <DropdownHeading>Heading</DropdownHeading>
 *    <DropdownList>
 *      <DropdownItem>
 *        <DropdownButton>Button</DropdownButton>
 *      </DropdownItem>
 *    </DropdownList>
 *  </Dropdown>
 * </DropdownTriggerContext>
 */
export const DropdownTriggerContext = ({
  children,
}: DropdownTriggerContextProps) => {
  return <PopoverTriggerContext>{children}</PopoverTriggerContext>;
};

DropdownTriggerContext.displayName = 'DropdownTriggerContext';
