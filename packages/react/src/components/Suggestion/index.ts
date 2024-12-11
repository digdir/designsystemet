import { Suggestion as SuggestionRoot } from './Suggestion';
import { SuggestionEmpty } from './SuggestionEmpty';
import { SuggestionInput } from './SuggestionInput';
import { SuggestionList } from './SuggestionList';

const Suggestion = Object.assign(SuggestionRoot, {
  List: SuggestionList,
  Input: SuggestionInput,
  Empty: SuggestionEmpty,
});

export { Suggestion, SuggestionList, SuggestionInput, SuggestionEmpty };
export type { SuggestionProps } from './Suggestion';
export type { SuggestionListProps } from './SuggestionList';
export type { SuggestionInputProps } from './SuggestionInput';
