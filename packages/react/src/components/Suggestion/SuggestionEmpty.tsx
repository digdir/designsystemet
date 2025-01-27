import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type SuggestionEmptyProps = HTMLAttributes<HTMLDivElement> &
  DefaultProps;

/**
 * Component that provides an empty suggestion list.
 *
 * Place as a descendant of `Suggestion.List`
 *
 * @example
 * <Suggestion.List>
 *   <Suggestion.Empty>Tomt</Suggestion.Empty>
 * </Suggestion.List>
 */
export const SuggestionEmpty = forwardRef<HTMLDivElement, SuggestionEmptyProps>(
  function SuggestionEmpty(rest, ref) {
    return (
      <div
        aria-disabled='true'
        ref={ref}
        role='option'
        tabIndex={0}
        {...rest}
      />
    );
  },
);
