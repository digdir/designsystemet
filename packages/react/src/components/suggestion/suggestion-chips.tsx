import type { HTMLAttributes } from 'react';
import type { DefaultProps } from '../../types';

export type SuggestionChipsProps = DefaultProps &
  HTMLAttributes<HTMLDivElement>;

/**
 * @deprecated Suggestion.Chips is deprecated, use `renderSelected` on `Suggestion` instead
 */
export const SuggestionChips = () => {
  console.warn(
    'Suggestion: Using <Suggestion.Chips> is deprecated - please remove from your code.',
  );
  return null;
};

SuggestionChips.displayName = 'SuggestionChips';
