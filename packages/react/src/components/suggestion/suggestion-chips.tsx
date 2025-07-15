import type { HTMLAttributes } from 'react';
import type { DefaultProps } from '../../types';

export type SuggestionChipsProps = DefaultProps &
  HTMLAttributes<HTMLDivElement>;

export const SuggestionChips = () => {
  console.warn(
    'Using <Suggestion.Chips> is deprecated - please remove from your code.',
  );
  return null;
};

SuggestionChips.displayName = 'SuggestionChips';
