import type { OptionHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import '@digdir/designsystemet-web'; // Load u-option polyfill

export type SuggestionOptionProps = OptionHTMLAttributes<HTMLOptionElement> &
  DefaultProps;

/**
 * A component for rendering individual options in the Suggestion list.
 *
 * @example
 * <Suggestion>
 *   <Suggestion.Input />
 *   <Suggestion.List>
 *     <Suggestion.Option value='Option 1'>Option 1</Suggestion.Option>
 *     <Suggestion.Option value='Option 2'>Option 2</Suggestion.Option>
 *   </Suggestion.List>
 * </Suggestion>
 */
export const SuggestionOption = forwardRef<
  HTMLOptionElement,
  SuggestionOptionProps
>(function SuggestionOption({ className, ...rest }, ref) {
  return (
    <u-option
      class={className} // Using "class" since React does not translate className on custom elements
      ref={ref}
      suppressHydrationWarning // Since <u-option> adds attributes
      {...rest}
    />
  );
});
