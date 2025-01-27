import type { OptionHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import '@u-elements/u-datalist';

export type SuggestionOptionProps = OptionHTMLAttributes<HTMLOptionElement> &
  DefaultProps;

/**
 * Component that provides an option for the suggestion list.
 *
 * Place as a descendant of `Suggestion.List`
 *
 * @example
 * <Suggestion.List>
 *   <Suggestion.Option value='Option 1'>Option 1</Suggestion.Option>
 * </Suggestion.List>
 */
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
