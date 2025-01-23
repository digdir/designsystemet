import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { OptgroupHTMLAttributes } from 'react';

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
 *   <Select.Optgroup label='Group 1'>
 *     <Select.Option value='1'>Option 1</Select.Option>
 *     <Select.Option value='2'>Option 2</Select.Option>
 *   </Select.Optgroup>
 * </Select>
 */
export const SelectOptgroup = forwardRef<
  HTMLOptGroupElement,
  SelectOptgroupProps
>(function SelectOptgroup({ asChild, ...rest }, ref) {
  const Component = asChild ? Slot : 'optgroup';

  return <Component {...rest} ref={ref} />;
});
