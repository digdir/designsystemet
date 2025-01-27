import type { OptionHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import '@u-elements/u-datalist';

export type SuggestionOptionProps = OptionHTMLAttributes<HTMLOptionElement> &
  DefaultProps;

export const SuggestionOption = forwardRef<
  HTMLOptionElement,
  SuggestionOptionProps
>(function SuggestionOption({ className, ...rest }, ref) {
  return (
    <u-option
      class={className} // Using "class" since React does not translate className on custom elements
      ref={ref}
      {...rest}
    />
  );
});
