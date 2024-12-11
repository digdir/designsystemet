import { Suggestion as SuggestionRoot } from './Suggestion';
import { SuggestionClear } from './SuggestionClear';
import { SuggestionEmpty } from './SuggestionEmpty';
import { SuggestionInput } from './SuggestionInput';
import { SuggestionList } from './SuggestionList';
import { SuggestionOption } from './SuggestionOption';

const Suggestion = Object.assign(SuggestionRoot, {
  List: SuggestionList,
  Input: SuggestionInput,
  Empty: SuggestionEmpty,
  Option: SuggestionOption,
  Clear: SuggestionClear,
});

Suggestion.List.displayName = 'Suggestion.List';
Suggestion.Input.displayName = 'Suggestion.Input';
Suggestion.Empty.displayName = 'Suggestion.Empty';
Suggestion.Option.displayName = 'Suggestion.Option';
Suggestion.Clear.displayName = 'Suggestion.Clear';

export { Suggestion, SuggestionList, SuggestionInput, SuggestionEmpty };
export type { SuggestionProps } from './Suggestion';
export type { SuggestionListProps } from './SuggestionList';
export type { SuggestionInputProps } from './SuggestionInput';
export type { SuggestionEmptyProps } from './SuggestionEmpty';
export type { SuggestionOptionProps } from './SuggestionOption';
export type { SuggestionClearProps } from './SuggestionClear';
