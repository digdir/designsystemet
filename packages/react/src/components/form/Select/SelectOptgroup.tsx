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

export const SelectOptgroup = forwardRef<
  HTMLOptGroupElement,
  SelectOptgroupProps
>(function SelectOptgroup({ asChild, ...rest }, ref) {
  const Component = asChild ? Slot : 'optgroup';

  return <Component {...rest} ref={ref} />;
});
