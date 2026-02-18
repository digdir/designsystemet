import { type DelHTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

/* We omit children since we render the icon with css */
export type SuggestionClearProps = MergeRight<
  DefaultProps & DelHTMLAttributes<HTMLModElement>,
  {
    /**
     * Aria label for the clear button
     * @default 'Tøm'
     */
    'aria-label'?: string;
  }
>;

/**
 * Component that provides a clear button for the Suggestion input.
 *
 * Place as a descendant of `Suggestion`
 *
 * @example
 * <Suggestion>
 *   <Suggestion.Input />
 *   <Suggestion.Clear />
 *   <Suggestion.List />
 * </Suggestion>
 */
export const SuggestionClear = forwardRef<HTMLModElement, SuggestionClearProps>(
  function SuggestionClear({ 'aria-label': label = 'Tøm', ...rest }, ref) {
    return (
      //biome-ignore lint/a11y/useAriaPropsSupportedByRole: <del> needs aria-label when u-combobox makes it the clear button
      <del
        aria-label={label}
        hidden
        ref={ref}
        suppressHydrationWarning // Since <ds-suggestion> adds attributes
        {...rest}
      />
    );
  },
);
