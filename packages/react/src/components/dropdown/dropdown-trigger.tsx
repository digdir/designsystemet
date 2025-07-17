import { forwardRef } from 'react';
import {
  PopoverTrigger,
  type PopoverTriggerProps,
} from '../popover/popover-trigger';

export type DropdownTriggerProps = PopoverTriggerProps;

/**
 * DropdownTrigger component, used within a Dropdown.TriggerContext to open a Dropdown.
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
export const DropdownTrigger = forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(function DropdownTrigger({ asChild, ...rest }, ref) {
  return <PopoverTrigger ref={ref} {...rest} />;
});
