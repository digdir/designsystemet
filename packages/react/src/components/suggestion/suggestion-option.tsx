import type { OptionHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import '@digdir/designsystemet-web'; // Load u-option polyfill

export type SuggestionOptionProps = OptionHTMLAttributes<HTMLOptionElement> &
  DefaultProps & {
    /**
     * Optionally the text to display when the suggestion list is empty.
     * If <Suggestion> has `data-creatable`, use `%s` to replace with the current input value.
     **/
    'data-empty'?: string | boolean;
  };

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
