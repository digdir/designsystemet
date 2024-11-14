import type { OptionHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../../../types';
import '@u-elements/u-datalist';

export type ComboboxOptionProps = OptionHTMLAttributes<HTMLOptionElement> &
  DefaultProps;
export const ComboboxOption = forwardRef<
  HTMLOptionElement,
  ComboboxOptionProps
>(function ComboboxOption({ className, ...rest }, ref) {
  // Using "class" since React does not translate className on custom elements
  return <u-option class={className} ref={ref} {...rest} />;
});
