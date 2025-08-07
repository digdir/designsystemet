import { Slot } from '@radix-ui/react-slot';
import type { OptgroupHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type SelectOptgroupProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & OptgroupHTMLAttributes<HTMLOptGroupElement>;

/**
 * SelectOptgroup component, used to display a native optgroup within a select.
 *
 * @example
 * <Select>
 *   <SelectOptgroup label='Group 1'>
 *     <SelectOption value='1'>Option 1</SelectOption>
 *     <SelectOption value='2'>Option 2</SelectOption>
 *   </SelectOptgroup>
 * </Select>
 */
export const SelectOptgroup = forwardRef<
  HTMLOptGroupElement,
  SelectOptgroupProps
>(function SelectOptgroup({ asChild, ...rest }, ref) {
  const Component = asChild ? Slot : 'optgroup';

  return <Component {...rest} ref={ref} />;
});
