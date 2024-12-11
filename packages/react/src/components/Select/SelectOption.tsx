import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { OptionHTMLAttributes } from 'react';

export type SelectOptionProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & OptionHTMLAttributes<HTMLOptionElement>;

export const SelectOption = forwardRef<HTMLOptionElement, SelectOptionProps>(
  function SelectOption({ asChild, ...rest }, ref) {
    const Component = asChild ? Slot : 'option';

    return <Component {...rest} ref={ref} />;
  },
);
