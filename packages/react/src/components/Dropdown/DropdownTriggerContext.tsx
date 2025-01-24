import type { ReactNode } from 'react';

import { PopoverTriggerContext } from '../Popover';

export type DropdownTriggerContextProps = {
  children: ReactNode;
};

/**
 * DropdownTriggerContext enables use of the `.Trigger` for the Dropdown component.
 *
 * @example
 * <Dropdown.TriggerContext>
 *  <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
 *  <Dropdown>
 *   <Dropdown.Heading>Heading</Dropdown.Heading>
 *    <Dropdown.List>
 *      <Dropdown.Item>
 *        <Dropdown.Button>Button</Dropdown.Button>
 *      </Dropdown.Item>
 *    </Dropdown.List>
 *  </Dropdown>
 * </Dropdown.TriggerContext>
 */
export const DropdownTriggerContext = ({
  children,
}: DropdownTriggerContextProps) => {
  return <PopoverTriggerContext>{children}</PopoverTriggerContext>;
};

DropdownTriggerContext.displayName = 'DropdownTriggerContext';
