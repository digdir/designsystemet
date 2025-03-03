import type { OptionHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import '@u-elements/u-datalist';

export type MultiSuggestionOptionProps =
  OptionHTMLAttributes<HTMLOptionElement> & DefaultProps;

export const MultiSuggestionOption = forwardRef<
  HTMLOptionElement,
  MultiSuggestionOptionProps
>(function MultiSuggestionOption({ className, ...rest }, ref) {
  return (
    <u-option
      class={className} // Using "class" since React does not translate className on custom elements
      ref={ref}
      {...rest}
    />
  );
});
