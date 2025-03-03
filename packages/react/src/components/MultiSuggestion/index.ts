import { MultiSuggestion as MultiSuggestionRoot } from './MultiSuggestion';
import { MultiSuggestionChips } from './MultiSuggestionChips';
import { MultiSuggestionClear } from './MultiSuggestionClear';
import { MultiSuggestionEmpty } from './MultiSuggestionEmpty';
import { MultiSuggestionInput } from './MultiSuggestionInput';
import { MultiSuggestionList } from './MultiSuggestionList';
import { MultiSuggestionOption } from './MultiSuggestionOption';

const MultiSuggestion = Object.assign(MultiSuggestionRoot, {
  Input: MultiSuggestionInput,
  List: MultiSuggestionList,
  Option: MultiSuggestionOption,
  Chips: MultiSuggestionChips,
  Empty: MultiSuggestionEmpty,
  Clear: MultiSuggestionClear,
});

MultiSuggestion.displayName = 'EXPERIMENTRAL_MultiSuggestion';
MultiSuggestion.Input.displayName = 'EXPERIMENTRAL_MultiSuggestion.Input';
MultiSuggestion.List.displayName = 'EXPERIMENTRAL_MultiSuggestion.List';
MultiSuggestion.Option.displayName = 'EXPERIMENTRAL_MultiSuggestion.Option';
MultiSuggestion.Chips.displayName = 'EXPERIMENTRAL_MultiSuggestion.Chips';
MultiSuggestion.Empty.displayName = 'EXPERIMENTRAL_MultiSuggestion.Empty';
MultiSuggestion.Clear.displayName = 'EXPERIMENTRAL_MultiSuggestion.Clear';

export {
  MultiSuggestion as EXPERIMENTAL_MultiSuggestion,
  MultiSuggestionInput as EXPERIMENTAL_MultiSuggestionInput,
  MultiSuggestionList as EXPERIMENTAL_MultiSuggestionList,
  MultiSuggestionOption as EXPERIMENTAL_MultiSuggestionOption,
  MultiSuggestionChips as EXPERIMENTAL_MultiSuggestionChips,
  MultiSuggestionEmpty as EXPERIMENTAL_MultiSuggestionEmpty,
  MultiSuggestionClear as EXPERIMENTAL_MultiSuggestionClear,
};

export type { MultiSuggestionProps } from './MultiSuggestion';
export type { MultiSuggestionInputProps } from './MultiSuggestionInput';
export type { MultiSuggestionListProps } from './MultiSuggestionList';
export type { MultiSuggestionOptionProps } from './MultiSuggestionOption';
export type { MultiSuggestionChipsProps } from './MultiSuggestionChips';
export type { MultiSuggestionEmptyProps } from './MultiSuggestionEmpty';
export type { MultiSuggestionClearProps } from './MultiSuggestionClear';
