import type { OptionHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import '@digdir/designsystemet-web'; // Load u-option polyfill

export type SuggestionEmptyProps = DefaultProps &
  OptionHTMLAttributes<HTMLOptionElement> & {
    /**
     * Optionally the text to display when the suggestion list is empty.
     * If <Suggestion> has `data-creatable`, use `{value}` to replace with the current input value.
     **/
    'data-empty'?: string;
  };

/**
 * Component that provides an empty Suggestion list.
 *
 * Place as a descendant of `Suggestion.List`
 *
 * @example
 * <Suggestion.List>
 *   <Suggestion.Empty>Tomt</Suggestion.Empty>
 * </Suggestion.List>
 */
export const SuggestionEmpty = forwardRef<
  HTMLOptionElement,
  SuggestionEmptyProps
>(function SuggestionEmpty(rest, ref) {
  return (
    <u-option
      data-empty // Ensures attribute is always present
      ref={ref}
      suppressHydrationWarning // Since <u-option> adds attributes
      {...rest}
    />
  );
});
