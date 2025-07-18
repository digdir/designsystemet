import { Slot } from '@radix-ui/react-slot';
import type { OptionHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type SelectOptionProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & OptionHTMLAttributes<HTMLOptionElement>;

/**
 * SelectOption component, used to display a native option within a select.
 *
 * @example
 * <Select>
 *   <SelectOption value='1'>Option 1</SelectOption>
 *   <SelectOption value='2'>Option 2</SelectOption>
 * </Select>
 */
export const SelectOption = forwardRef<HTMLOptionElement, SelectOptionProps>(
  function SelectOption({ asChild, ...rest }, ref) {
    const Component = asChild ? Slot : 'option';

    return <Component {...rest} ref={ref} />;
  },
);
